import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import GoogleCallback from './components/GoogleCallback'

function App() {
  return (
    <Router basename="/frontend_ai">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="*" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App