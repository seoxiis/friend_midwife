import { useState, useEffect } from 'react'
import App from './App'
import AdminPanel from './components/AdminPanel'

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (currentPath === '/admin') {
    return <AdminPanel />
  }

  return <App />
}
