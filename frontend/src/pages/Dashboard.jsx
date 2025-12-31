import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎯</span>
                        <span className="text-2xl font-extrabold text-gradient">Recrux</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Welcome back,</p>
                            <p className="font-semibold text-gray-900">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold mb-2">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-gray-600 mb-8">
                    Manage your recruitment process with AI-powered tools
                </p>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-700">Active Jobs</h3>
                            <span className="text-3xl">💼</span>
                        </div>
                        <p className="text-4xl font-extrabold text-primary-600">0</p>
                        <p className="text-sm text-gray-500 mt-1">No jobs posted yet</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-700">Total Candidates</h3>
                            <span className="text-3xl">👥</span>
                        </div>
                        <p className="text-4xl font-extrabold text-primary-600">0</p>
                        <p className="text-sm text-gray-500 mt-1">Start screening resumes</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-700">Shortlisted</h3>
                            <span className="text-3xl">⭐</span>
                        </div>
                        <p className="text-4xl font-extrabold text-primary-600">0</p>
                        <p className="text-sm text-gray-500 mt-1">Top candidates</p>
                    </div>
                </div>

                {/* User Information Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="font-semibold text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Role</p>
                            <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Company</p>
                            <p className="font-semibold text-gray-900">{user?.company_name || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Account Status</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                ✓ Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-500 p-8 rounded-xl text-white">
                    <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                    <p className="mb-6 text-primary-100">
                        Create your first job posting and start screening candidates with AI
                    </p>
                    <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                        Create Job Posting
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
