import { useState } from 'react'
import './App.css'
import { BlogProvider } from './context/BlogContext'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'

function App() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <BlogProvider>
      <div className="app-shell">
        <Header onOpenAuth={() => setShowAuth(true)} />
        <HomePage />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    </BlogProvider>
  )
}

export default App
