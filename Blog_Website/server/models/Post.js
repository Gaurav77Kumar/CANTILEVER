import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  excerpt: { type: String, required: true, trim: true, maxlength: 280 },
  content: { type: String, required: true },
  category: { type: String, enum: ['Ideas', 'Making', 'Culture', 'Life'], default: 'Ideas' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

export default mongoose.model('Post', postSchema)
