import { Router } from 'express'
import Post from '../models/Post.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (request, response) => {
  try { response.json(await Post.find().populate('author', 'name').sort({ createdAt: -1 })) }
  catch (error) { response.status(500).json({ message: error.message }) }
})

router.post('/', requireAuth, async (request, response) => {
  try { response.status(201).json(await Post.create({ ...request.body, author: request.userId })) }
  catch (error) { response.status(400).json({ message: error.message }) }
})

router.put('/:id', requireAuth, async (request, response) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: request.params.id, author: request.userId }, request.body, { new: true, runValidators: true })
    if (!post) return response.status(404).json({ message: 'Post not found or not owned by you' })
    response.json(post)
  } catch (error) { response.status(400).json({ message: error.message }) }
})

router.delete('/:id', requireAuth, async (request, response) => {
  try {
    const post = await Post.findOneAndDelete({ _id: request.params.id, author: request.userId })
    if (!post) return response.status(404).json({ message: 'Post not found or not owned by you' })
    response.json({ message: 'Post deleted' })
  } catch (error) { response.status(400).json({ message: error.message }) }
})

export default router
