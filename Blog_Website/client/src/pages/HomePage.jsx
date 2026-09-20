import { useState } from 'react'
import { useBlog } from '../context/BlogContext'
import PostCard from '../components/PostCard'
import PostEditor from '../components/PostEditor'

function HomePage() {
  const { user, posts, status, setStatus } = useBlog()
  const [query, setQuery] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const visiblePosts = posts.filter((post) => `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query.toLowerCase()))

  const startWriting = () => {
    setEditingPost(null)
    setStatus('')
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })
  }

  const startEditing = (post) => {
    setEditingPost(post)
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <>
    <main id="top">
      <section className="intro"><div><p className="eyebrow">Openbook journal</p><h1>Stories for<br /><em>curious minds.</em></h1><p className="intro-copy">Ideas, conversations, and practical inspiration from people making sense of the world around them.</p></div><div className="intro-collage" aria-hidden="true"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85" alt="" /><span>Read<br />something<br />new</span></div></section>
      <section className="toolbar" id="latest"><div><p className="eyebrow">The collection</p><h2>All blog posts</h2></div><div className="toolbar-actions"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories" /></label>{user && <button className="button button-coral" onClick={startWriting}>Write a story</button>}</div></section>
      {status && <p className="status" role="status">{status}</p>}
      <section className="post-grid">{visiblePosts.length ? visiblePosts.map((post) => <PostCard key={post._id} post={post} onEdit={startEditing} />) : <div className="empty">No stories found yet. Be the first to write one.</div>}</section>
      {user && <PostEditor editingPost={editingPost} onCancel={() => setEditingPost(null)} />}
    </main>
    <footer className="site-footer" id="about"><span>Openbook © 2024</span><span>Made for thoughtful things.</span></footer>
  </>
}

export default HomePage
