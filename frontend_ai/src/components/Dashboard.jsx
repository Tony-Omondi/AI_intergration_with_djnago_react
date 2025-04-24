import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
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
        setUser(response.data)
      } catch (err) {
        console.error('Failed to fetch user:', err)
        localStorage.removeItem('token')
        navigate('/frontend_ai/login')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [navigate])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/frontend_ai/')
  }

  const profilePictureUrl = user?.profile?.profile_picture 
    ? user.profile.profile_picture.startsWith('http') 
      ? user.profile.profile_picture 
      : `${BASE_URL}${user.profile.profile_picture}`
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
                  {user?.profile?.full_name?.[0] || 'U'}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800 truncate max-w-[150px]">
                  {user?.profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500">View profile</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              <a 
                href="/frontend_ai/dashboard" 
                className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Dashboard</span>
              </a>
              <a 
                href="/frontend_ai/closet" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span>My Closet</span>
              </a>
              <a 
                href="/frontend_ai/events" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Events</span>
                <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">12</span>
              </a>
              <a 
                href="" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143l-5.714 2.714L13 21l-2.286-6.857L5 11.857l5.714-2.714L13 3z"></path>
                </svg>
                <span>Recommendations</span>
              </a>
              <a 
                href="/frontend_ai/profile" 
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.profile?.full_name?.split(' ')[0] || 'User'}!
                  </h1>
                  <p className="text-gray-600">Here's what's happening with your wardrobe today</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Quick Add
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-bold text-gray-800">210</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Events</p>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-pink-100 text-pink-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Favorite Outfits</p>
                    <p className="text-2xl font-bold text-gray-800">14</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wardrobe Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Your Wardrobe</h2>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    View All
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/2">
                    <img 
                      src="https://images.pexels.com/photos/5705490/pexels-photo-5705490.jpeg?auto=compress&cs=tinysrgb&w=600" 
                      alt="Closet Preview" 
                      className="w-full h-48 md:h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Style Inventory</h3>
                    <p className="text-gray-600 mb-4">View and manage all your clothing items in one place. Organize by category, season, or occasion.</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Tops</p>
                        <p className="text-xl font-bold text-gray-800">78</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bottoms</p>
                        <p className="text-xl font-bold text-gray-800">42</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shoes</p>
                        <p className="text-xl font-bold text-gray-800">24</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Accessories</p>
                        <p className="text-xl font-bold text-gray-800">36</p>
                      </div>
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md">
                      View Full Closet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    View All
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/2">
                    <div className="bg-gray-100 h-48 md:h-64 rounded-lg flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Scheduled Events</h3>
                    <p className="text-gray-600 mb-4">Plan your outfits for upcoming occasions and never be caught unprepared.</p>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Business Meeting</p>
                          <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 bg-purple-100 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Friend's Wedding</p>
                          <p className="text-sm text-gray-500">Saturday, 2:00 PM</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md">
                      Plan Outfits
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Outfit Recommendations */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Recommended Outfits</h2>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    View All
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/2">
                    <div className="bg-gray-100 h-48 md:h-64 rounded-lg flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">AI-Curated Outfits</h3>
                    <p className="text-gray-600 mb-4">Discover new outfit combinations based on your wardrobe and preferences.</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Casual</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Formal</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Work</span>
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md">
                      Get Recommendations
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard