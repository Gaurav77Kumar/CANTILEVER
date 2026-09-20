import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()
const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email })

router.post('/register', async (request, response) => {
  try {
    const { name, email, password } = request.body
    if (!name || !email || !password) return response.status(400).json({ message: 'Name, email, and password are required' })
    if (password.length < 6) return response.status(400).json({ message: 'Password must be at least 6 characters' })
    if (await User.findOne({ email })) return response.status(409).json({ message: 'An account with that email already exists' })
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) })
    response.status(201).json({ token: createToken(user._id), user: publicUser(user) })
  } catch (error) { response.status(500).json({ message: error.message }) }
})

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await bcrypt.compare(password || '', user.password))) return response.status(401).json({ message: 'Incorrect email or password' })
    response.json({ token: createToken(user._id), user: publicUser(user) })
  } catch (error) { response.status(500).json({ message: error.message }) }
})

export default router
