import { useState } from 'react'
import { useBlog } from '../context/BlogContext'

const emptyPost = { title: '', excerpt: '', content: '', category: 'Ideas' }

function PostEditor({ editingPost, onCancel }) {
  const { savePost } = useBlog()
  const [form, setForm] = useState(editingPost ? { title: editingPost.title, excerpt: editingPost.excerpt, content: editingPost.content, category: editingPost.category } : emptyPost)

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    try { await savePost(form, editingPost); if (editingPost) onCancel(); else setForm(emptyPost) }
    catch { }
  }

  return <section className="editor" id="editor">
    <div><p className="eyebrow">Your desk</p><h2>{editingPost ? 'Edit your story' : 'Write a story'}</h2><p>Share something useful, honest, or beautifully unfinished.</p></div>
    <form onSubmit={submit}><input name="title" required value={form.title} onChange={update} placeholder="A title with a point of view" /><div className="form-row"><input name="excerpt" required value={form.excerpt} onChange={update} placeholder="A one-sentence excerpt" /><select name="category" value={form.category} onChange={update}><option>Ideas</option><option>Making</option><option>Culture</option><option>Life</option></select></div><textarea name="content" required value={form.content} onChange={update} placeholder="Begin writing..."></textarea><div className="form-actions"><button className="button button-dark" type="submit">{editingPost ? 'Save changes' : 'Publish story'}</button>{editingPost && <button type="button" className="text-button" onClick={onCancel}>Cancel</button>}</div></form>
  </section>
}

export default PostEditor
