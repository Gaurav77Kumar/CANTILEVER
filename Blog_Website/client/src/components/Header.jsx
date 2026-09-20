import { useBlog } from '../context/BlogContext'

function Header({ onOpenAuth }) {
  const { user, logout } = useBlog()

  return <header className="topbar">
    <a className="brand" href="#top"><span>O</span> Openbook</a>
    <nav><a href="#latest">Latest</a><a href="#about">About</a></nav>
    <div className="account-actions">
      {user ? <><span className="user-name">Hi, {user.name}</span><button className="text-button" onClick={logout}>Log out</button></> : <button className="button button-dark" onClick={onOpenAuth}>Join Openbook</button>}
    </div>
  </header>
}

export default Header
