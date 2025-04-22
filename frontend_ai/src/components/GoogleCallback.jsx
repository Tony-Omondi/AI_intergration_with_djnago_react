import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const GoogleCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/google/callback/', {
          withCredentials: true, // Include cookies for session authentication
        })
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      } catch (err) {
        console.error('Google login failed:', err)
        navigate('/login')
      }
    }

    fetchToken()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Processing Google login...</p>
    </div>
  )
}

export default GoogleCallback