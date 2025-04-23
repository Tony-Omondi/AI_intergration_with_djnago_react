import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email.')
      return
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/password-reset/', {
        email,
      })
      setMessage(response.data.message)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/src/assets/closetai-logo.jpg" 
            alt="ClosetAI Logo" 
            className="h-12 md:h-14 w-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">Forgot Password</h2>

        {/* Message */}
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="gradient-btn w-full py-3 rounded-lg text-white font-medium text-sm md:text-base"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Remember your password?{' '}
          <a href="/frontend_ai/login" className="text-indigo-600 font-medium link-hover">Login</a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword