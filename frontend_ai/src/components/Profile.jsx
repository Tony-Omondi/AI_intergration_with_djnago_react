import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000' // Add base URL for the backend

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false) // For sidebar toggle on mobile
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    location: '',
    profile_picture: null,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/frontend_ai/login')
          return
        }
        const response = await axios.get('http://localhost:8000/api/auth/profile/', {
          headers: { Authorization: `Token ${token}` },
        })
        console.log('Profile API Response:', response.data) // Log the response
        setProfile(response.data)
        setFormData({
          full_name: response.data.profile.full_name || '',
          age: response.data.profile.age || '',
          gender: response.data.profile.gender || '',
          location: response.data.profile.location || '',
          profile_picture: null,
        })

        // Fetch user's location using Geolocation API
        if (!response.data.profile.location && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              try {
                const geoResponse = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                )
                const geoData = await geoResponse.json()
                const city = geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown City'
                setFormData((prev) => ({ ...prev, location: city }))
                // Update location on the backend
                await axios.patch(
                  'http://localhost:8000/api/auth/profile/',
                  { location: city },
                  { headers: { Authorization: `Token ${token}` } }
                )
              } catch (err) {
                console.error('Geolocation error:', err)
              }
            },
            (err) => {
              console.error('Geolocation access denied:', err)
            }
          )
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.')
      }
    }
    fetchProfile()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profile_picture: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      for (const key in formData) {
        if (formData[key]) {
          data.append(key, formData[key])
        }
      }

      const response = await axios.patch('http://localhost:8000/api/auth/profile/', data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setProfile({ ...profile, profile: response.data })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/frontend_ai/login')
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  if (!profile) return <div>Loading...</div>

  // Ensure profile picture URL is absolute
  const profilePictureUrl = profile.profile.profile_picture 
    ? profile.profile.profile_picture.startsWith('http') 
      ? profile.profile.profile_picture 
      : `${BASE_URL}${profile.profile.profile_picture}`
    : null

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Sidebar Overlay (Mobile Only) */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Toggle for Mobile */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md" 
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <div className={`sidebar w-64 bg-white shadow-lg p-4 md:p-6 flex flex-col fixed md:static h-full z-50 ${isOpen ? 'open' : ''}`}>
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
            <img 
              src="/src/assets/closetai-logo.jpg" 
              alt="ClosetAI Logo" 
              className="h-12 md:h-14 w-auto"
            />
          </div>

          {/* User Info */}
          <div className="flex items-center mb-6 md:mb-8">
            {profilePictureUrl ? (
              <img 
                src={profilePictureUrl} 
                alt="User Avatar" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                <span className="text-sm md:text-base">{profile.profile.full_name[0]}</span>
              </div>
            )}
            <span className="text-gray-800 font-semibold text-base md:text-lg">{profile.profile.full_name}</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <a href="/frontend_ai/dashboard" className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 font-medium mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </a>
            <a href="#" className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 font-medium mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              My Closet
            </a>
            <a href="#" className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 font-medium mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Events
              <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">12</span>
            </a>
            <a href="#" className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 font-medium mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143l-5.714 2.714L13 21l-2.286-6.857L5 11.857l5.714-2.714L13 3z"></path>
              </svg>
              Recommendations
            </a>
            <a href="/frontend_ai/profile" className="nav-item active flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 font-medium mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 font-medium mt-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:ml-64">
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">Your Profile</h2>

            {/* Messages */}
            {message && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Profile Form */}
            <div>
              <div className="mb-4">
                <label htmlFor="full_name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="age" className="block text-gray-700 font-medium mb-2">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter your age"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">City</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter your city"
                />
                <p className="text-gray-500 text-xs mt-1">We only use your city for weather-based recommendations.</p>
              </div>
              <div className="mb-6">
                <label htmlFor="profile_picture" className="block text-gray-700 font-medium mb-2">Profile Picture</label>
                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  onChange={handleFileChange}
                  className="input-field w-full p-3 border border-gray-300 rounded-lg"
                  accept="image/*"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="gradient-btn w-full py-3 rounded-lg text-white font-medium text-sm md:text-base"
              >
                Update Profile
              </button>
            </div>

            {/* Logout Link */}
            <p className="text-center mt-6 text-gray-600 text-sm">
              <button onClick={handleLogout} className="text-indigo-600 font-medium hover:underline">
                Logout
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © 2025 ClosetAI. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <a href="#" className="text-gray-600 text-sm link-hover">About</a>
              <a href="#" className="text-gray-600 text-sm link-hover">Contact</a>
              <a href="#" className="text-gray-600 text-sm link-hover">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Profile