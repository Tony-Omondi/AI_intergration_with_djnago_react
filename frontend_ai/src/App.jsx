import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import GoogleCallback from './components/GoogleCallback'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/frontend_ai/" element={<Signup />} />
        <Route path="/frontend_ai/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/frontend_ai/forgot-password" element={<ForgotPassword />} />
        <Route path="/frontend_ai/reset-password/:uidb64/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App