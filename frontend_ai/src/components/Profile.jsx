import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    location: '',
    profile_picture: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/frontend_ai/login')
          return
        }
        
        setIsLoading(true)
        const response = await axios.get(`${BASE_URL}/api/auth/profile/`, {
          headers: { Authorization: `Token ${token}` },
        })
        
        setProfile(response.data)
        setFormData({
          full_name: response.data.profile.full_name || '',
          age: response.data.profile.age || '',
          gender: response.data.profile.gender || '',
          location: response.data.profile.location || '',
          profile_picture: null,
        })

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
                await axios.patch(
                  `${BASE_URL}/api/auth/profile/`,
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
      } finally {
        setIsLoading(false)
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

      const response = await axios.patch(`${BASE_URL}/api/auth/profile/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setProfile({ ...profile, profile: response.data })
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 5000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/frontend_ai/login')
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const profilePictureUrl = profile?.profile?.profile_picture 
    ? profile.profile.profile_picture.startsWith('http') 
      ? profile.profile.profile_picture 
      : `${BASE_URL}${profile.profile.profile_picture}`
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Mobile Sidebar Toggle */}
      <button 
        className={`md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md transition-all ${isOpen ? 'transform rotate-90' : ''}`}
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100 md:opacity-0' : 'opacity-0 pointer-events-none'} md:hidden`}
        onClick={toggleSidebar}
      ></div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/src/assets/closetai-logo.jpg" 
                alt="ClosetAI Logo" 
                className="h-12 w-auto transition-opacity hover:opacity-90"
              />
            </div>

            {/* User Profile */}
            <div className="flex items-center mb-8 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              {profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt="User Avatar" 
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-indigo-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-medium text-xl mr-3">
                  {profile?.profile?.full_name?.[0] || 'U'}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800 truncate max-w-[150px]">
                  {profile?.profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500">View profile</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              <a 
                href="/frontend_ai/dashboard" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Dashboard</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span>My Closet</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Events</span>
                <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">12</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143l-5.714 2.714L13 21l-2.286-6.857L5 11.857l5.714-2.714L13 3z"></path>
                </svg>
                <span>Recommendations</span>
              </a>
              <a 
                href="/frontend_ai/profile" 
                className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Profile</span>
              </a>
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="relative">
                      {profilePictureUrl ? (
                        <img
                          src={profilePictureUrl}
                          alt="Profile"
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl text-indigo-600 font-medium border-4 border-white shadow-md">
                          {profile?.profile?.full_name?.[0] || 'U'}
                        </div>
                      )}
                      <button 
                        className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        onClick={() => document.getElementById('profile_picture').click()}
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
                      <input 
                        type="file" 
                        id="profile_picture"
                        name="profile_picture"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                    <div className="ml-6">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {profile?.profile?.full_name || 'Your Profile'}
                      </h1>
                      <p className="text-gray-600 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {profile?.profile?.location || 'Location not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => navigate('/frontend_ai/dashboard')}
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6 md:p-8">
                {message && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {message}
                  </div>
                )}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                        <option value="P">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Enter your city"
                      />
                      <p className="mt-1 text-xs text-gray-500">We use your location for weather-based recommendations</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                      <div className="flex items-center">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              {formData.profile_picture 
                                ? formData.profile_picture.name 
                                : 'SVG, PNG, JPG (max. 5MB)'}
                            </p>
                          </div>
                          <input 
                            type="file" 
                            name="profile_picture"
                            onChange={handleFileChange}
                            className="hidden" 
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/frontend_ai/dashboard')}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile