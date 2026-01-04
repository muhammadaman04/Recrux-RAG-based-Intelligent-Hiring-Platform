import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import CreateJob from './pages/CreateJob'
import EditJob from './pages/EditJob'
import UploadResumes from './pages/UploadResumes'
import Candidates from './pages/Candidates'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/jobs" element={
              <ProtectedRoute><Jobs /></ProtectedRoute>
            } />

            <Route path="/jobs/create" element={
              <ProtectedRoute><CreateJob /></ProtectedRoute>
            } />

            <Route path="/jobs/:jobId/edit" element={
              <ProtectedRoute><EditJob /></ProtectedRoute>
            } />

            <Route path="/jobs/:jobId/upload" element={
              <ProtectedRoute><UploadResumes /></ProtectedRoute>
            } />

            <Route path="/jobs/:jobId/candidates" element={
              <ProtectedRoute><Candidates /></ProtectedRoute>
            } />
          </Routes>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App
