import { useBlog } from '../context/BlogContext'

const coverImages = {
  Ideas: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85',
  Making: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85',
  Culture: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85',
  Life: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=85',
}

function PostCard({ post, onEdit }) {
  const { user, deletePost } = useBlog()
  const isOwner = user?._id === post.author?._id

  return <article className="post-card">
    <img className="post-cover" src={coverImages[post.category] || coverImages.Ideas} alt="" />
    <div className="post-meta"><span>{post.category}</span><span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
    <h3>{post.title}</h3>
    <p>{post.excerpt}</p>
    <footer><span>By {post.author?.name || 'Openbook'}</span>{isOwner && <div><button className="icon-button" title="Edit post" onClick={() => onEdit(post)}>Edit</button><button className="icon-button danger" title="Delete post" onClick={() => deletePost(post._id)}>Delete</button></div>}</footer>
  </article>
}

export default PostCard
