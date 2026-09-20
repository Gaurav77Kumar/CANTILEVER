import { createContext, useContext, useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BlogContext = createContext(null)

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

function storedUser() {
  try { return JSON.parse(localStorage.getItem('blog_user') || 'null') }
  catch { return null }
}

export function BlogProvider({ children }) {
  const [user, setUser] = useState(storedUser)
  const [token, setToken] = useState(() => localStorage.getItem('blog_token'))
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('')

  const loadPosts = async () => {
    try {
      setPosts(await request('/posts'))
      setStatus('')
    } catch (error) {
      setStatus(`${error.message}. Start MongoDB and the server to load posts.`)
    }
  }

  useEffect(() => { loadPosts() }, [])

  const authenticate = async (mode, form) => {
    const data = await request(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(form) })
    localStorage.setItem('blog_token', data.token)
    localStorage.setItem('blog_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    setStatus(`Welcome, ${data.user.name}.`)
  }

  const logout = () => {
    localStorage.removeItem('blog_token')
    localStorage.removeItem('blog_user')
    setToken(null)
    setUser(null)
    setStatus('You have been signed out.')
  }

  const savePost = async (post, editingPost) => {
    try {
      const path = editingPost ? `/posts/${editingPost._id}` : '/posts'
      await request(path, {
        method: editingPost ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(post),
      })
      await loadPosts()
      setStatus(editingPost ? 'Post updated.' : 'Your post is live.')
    } catch (error) {
      setStatus(error.message)
      throw error
    }
  }

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return
    try {
      await request(`/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      await loadPosts()
      setStatus('Post deleted.')
    } catch (error) { setStatus(error.message) }
  }

  return <BlogContext.Provider value={{ user, posts, status, setStatus, authenticate, logout, savePost, deletePost }}>{children}</BlogContext.Provider>
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) throw new Error('useBlog must be used inside BlogProvider')
  return context
}
