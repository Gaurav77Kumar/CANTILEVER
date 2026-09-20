import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/openbook')
  .then(() => app.listen(port, () => console.log(`Openbook API listening on http://localhost:${port}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1) })
