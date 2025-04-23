import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000' // Add base URL for the backend

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/frontend_ai/login')
          return
        }
        const response = await axios.get('http://localhost:8000/api/auth/profile/', {
          headers: { Authorization: `Token ${token}` },
        })
        console.log('User API Response:', response.data)
        setUser(response.data)
      } catch (err) {
        console.error('Failed to fetch user:', err)
        localStorage.removeItem('token')
        navigate('/frontend_ai/login')
      }
    }
    fetchUser()
  }, [navigate])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/frontend_ai/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  // Ensure profile picture URL is absolute
  const profilePictureUrl = user.profile.profile_picture 
    ? user.profile.profile_picture.startsWith('http') 
      ? user.profile.profile_picture 
      : `${BASE_URL}${user.profile.profile_picture}`
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
                <span className="text-sm md:text-base">{user.profile.full_name[0]}</span>
              </div>
            )}
            <span className="text-gray-800 font-semibold text-base md:text-lg">{user.profile.full_name}</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <a href="/frontend_ai/dashboard" className="nav-item active flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 font-medium mb-2">
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
            <a href="/frontend_ai/profile" className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 font-medium mb-2">
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
        <div className="flex-1">
          <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-10 md:ml-64">
            {/* Welcome Message */}
            <div className="pt-12 md:pt-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 md:mb-8 lg:mb-10">
                Welcome back, {user.profile.full_name.split(' ')[0]}
              </h1>
            </div>

            {/* Wardrobe Section */}
            <div className="mb-6 md:mb-8 lg:mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Your Wardrobe</h2>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 card bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-lg">
                <div className="flex-1 w-full md:w-auto">
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">210 <span className="text-sm md:text-base font-normal text-gray-600">ITEMS</span></p>
                  <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">View your style inventory.</p>
                  <a href="#" className="gradient-btn inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-medium text-xs md:text-sm">
                    View Closet
                    <svg className="w-3 h-3 md:w-4 md:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <img 
                  src="/src/assets/AdobeStock_1105381229_Preview.jpeg" 
                  alt="Closet Preview" 
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Events Section */}
            <div className="mb-6 md:mb-8 lg:mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Upcoming Events</h2>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 card bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-lg">
                <div className="flex-1 w-full md:w-auto">
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">3 <span className="text-sm md:text-base font-normal text-gray-600">EVENTS</span></p>
                  <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">Manage your schedule and outfits.</p>
                  <a href="#" className="gradient-btn inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-medium text-xs md:text-sm">
                    View Events
                    <svg className="w-3 h-3 md:w-4 md:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <img 
                  src="https://via.placeholder.com/150x100" 
                  alt="Events Preview" 
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Outfit of the Day Section */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Outfit of the Day</h2>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 card bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-lg">
                <div className="image-overlay w-full md:w-96 h-48 md:h-56">
                  <img 
                    src="https://via.placeholder.com/300x200" 
                    alt="Outfit of the Day" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 w-full md:w-auto">
                  <p className="text-gray-600 text-base md:text-lg mb-2 md:mb-3">Curated just for you.</p>
                  <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">Shop similar styles.</p>
                  <button className="gradient-btn inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-medium text-xs md:text-sm">
                    Discover More
                    <svg className="w-3 h-3 md:w-4 md:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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

export default Dashboard