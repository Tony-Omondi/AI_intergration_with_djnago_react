import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/frontend_ai/login')
  }

  const handleSignup = () => {
    navigate('/frontend_ai/signup')
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/src/assets/closetai-logo.jpg" 
              alt="ClosetAI Logo" 
              className="h-10 md:h-12 w-auto transition-all duration-300 hover:opacity-90"
            />
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGetStarted}
              className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 rounded-full text-white font-medium text-sm transition-all hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
            >
              Try Now
            </button>
            <button className="md:hidden p-2 text-gray-600 hover:text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your AI-Powered <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Personal Stylist</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Revolutionize your wardrobe with intelligent outfit recommendations and effortless closet management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
                >
                  Get Started
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <button
                  onClick={handleSignup}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-gray-300 text-gray-800 font-medium text-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-100 rounded-full opacity-20 mix-blend-multiply filter blur-xl"></div>
            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-purple-100 rounded-full opacity-20 mix-blend-multiply filter blur-xl"></div>
          </div>
        </section>

        {/* Logo Cloud */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide mb-8">
              Trusted by fashion enthusiasts worldwide
            </p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-center">
                  <div className="h-12 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 font-medium">Logo {i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Smart Features for Your Wardrobe</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                ClosetAI helps you make the most of your clothing collection with intelligent features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                    </svg>
                  ),
                  title: "Wardrobe Organization",
                  description: "Easily catalog and categorize all your clothing items with our intuitive interface.",
                  color: "bg-indigo-50"
                },
                {
                  icon: (
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  ),
                  title: "Event Planning",
                  description: "Never be caught unprepared with our event-based outfit planning system.",
                  color: "bg-purple-50"
                },
                {
                  icon: (
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path>
                    </svg>
                  ),
                  title: "AI Recommendations",
                  description: "Get personalized outfit suggestions based on your style preferences and occasion.",
                  color: "bg-pink-50"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`${feature.color} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2`}
                >
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <a href="#" className="text-indigo-600 font-medium hover:underline inline-flex items-center">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Detailed Feature Showcase */}
            <div className="space-y-16">
              {/* Wardrobe Summary */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white rounded-2xl p-6 md:p-10 shadow-lg overflow-hidden border border-gray-100">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 mb-4">Wardrobe</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Digital Closet Organization</h3>
                  <p className="text-gray-600 mb-6">
                    Upload photos of your clothing items and let our AI automatically categorize them by type, color, and season. 
                    Keep track of what you own and discover forgotten gems in your wardrobe.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Automatic categorization",
                      "Search and filter options",
                      "Wear tracking and statistics",
                      "Seasonal organization"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-full text-white font-medium hover:shadow-md transition-all hover:from-indigo-700 hover:to-purple-700"
                  >
                    Start Organizing
                  </button>
                </div>
                <div className="flex-1 relative">
                  <img 
                    src="/src/assets/wardrobe-preview.jpg" 
                    alt="Wardrobe Preview" 
                    className="w-full h-auto rounded-xl shadow-md transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-200 rounded-xl opacity-30 -z-10"></div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-200 rounded-xl opacity-30 -z-10"></div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white rounded-2xl p-6 md:p-10 shadow-lg overflow-hidden border border-gray-100">
                <div className="flex-1 relative">
                  <img 
                    src="/src/assets/event-planning.jpg" 
                    alt="Events Preview" 
                    className="w-full h-auto rounded-xl shadow-md transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-200 rounded-xl opacity-30 -z-10"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-200 rounded-xl opacity-30 -z-10"></div>
                </div>
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 mb-4">Planning</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Smart Event Outfit Planner</h3>
                  <p className="text-gray-600 mb-6">
                    Add your upcoming events and let ClosetAI suggest perfect outfits based on the occasion, 
                    weather forecast, and your personal style preferences.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="font-medium text-gray-700 mb-2">Upcoming events this week:</p>
                    <div className="space-y-2">
                      {[
                        { type: "Business Meeting", day: "Friday", color: "bg-green-400" },
                        { type: "Friend's Wedding", day: "Saturday", color: "bg-blue-400" }
                      ].map((event, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                          <p className="text-gray-600">{event.day} - {event.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-full text-white font-medium hover:shadow-md transition-all hover:from-indigo-700 hover:to-purple-700"
                  >
                    Plan Your Outfits
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of satisfied users who transformed their wardrobe experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Fashion Blogger",
                  content: "ClosetAI has completely transformed how I organize my wardrobe. The AI recommendations are spot-on!",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Business Professional",
                  content: "Never been late to an event since I started using the outfit planner. Lifesaver for busy professionals!",
                  rating: 5
                },
                {
                  name: "Emma Rodriguez",
                  role: "College Student",
                  content: "As a student on a budget, this helps me maximize my existing wardrobe. Highly recommend!",
                  rating: 4
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-md">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, star) => (
                      <svg 
                        key={star} 
                        className={`w-5 h-5 ${star < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Wardrobe?</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Join thousands of users who are discovering their perfect style with ClosetAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50"
              >
                Get Started Now
              </button>
              <button
                onClick={handleSignup}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Apps</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6">
              <img 
                src="/src/assets/closetai-logo-white.jpg" 
                alt="ClosetAI Logo" 
                className="h-8 w-auto"
              />
              <p className="text-gray-400 text-sm">© 2025 ClosetAI. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.137.353.3.882.344 1.857.047 1.023.058 1.351.058 3.807v.468c0 2.456-.011 2.784-.058 3.807-.045.975-.207 1.504-.344 1.857a4.902 4.902 0 01-.748 1.15 4.902 4.902 0 01-1.15.748c-.353.137-.882.3-1.857.344-1.023.047-1.351.058-3.807.058h-.468c-2.456 0-2.784-.011-3.807-.058-.975-.045-1.504-.207-1.857-.344a4.902 4.902 0 01-1.15-.748 4.902 4.902 0 01-.748-1.15c-.137-.353-.3-.882-.344-1.857-.047-1.023-.058-1.351-.058-3.807v-.468c0-2.456.011-2.784.058-3.807.045-.975.207-1.504.344-1.857a4.902 4.902 0 01.748-1.15 4.902 4.902 0 011.15-.748c.353-.137.882-.3 1.857-.344 1.023-.047 1.351-.058 3.807-.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a4.902 4.902 0 01-.748-1.15 4.902 4.902 0 01-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing