import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()
  const { uidb64, token } = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please choose a stronger password.')
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post(
        `http://localhost:8000/api/auth/password-reset-confirm/${uidb64}/${token}/`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      )
      setMessage(response.data.message || 'Password has been reset successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        navigate('/frontend_ai/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200'
      case 1: return 'bg-red-400'
      case 2: return 'bg-yellow-400'
      case 3: return 'bg-blue-400'
      case 4: return 'bg-green-500'
      default: return 'bg-gray-200'
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
            className="h-12 md:h-14 w-auto transition-opacity hover:opacity-90"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">Create New Password</h2>
        <p className="text-gray-600 text-center mb-6">Enter and confirm your new password</p>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {error}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                checkPasswordStrength(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter new password"
              required
              minLength="8"
            />
            {newPassword && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPasswordStrengthColor()}`} 
                    style={{ width: `${passwordStrength * 25}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password strength: {['Very weak', 'Weak', 'Moderate', 'Strong', 'Very strong'][passwordStrength]}
                </p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Confirm new password"
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </>
              ) : 'Reset Password'}
            </button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/frontend_ai/login')} 
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword