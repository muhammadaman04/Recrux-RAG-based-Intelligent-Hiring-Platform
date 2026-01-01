import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api/axios'

const Dashboard = () => {
    const { user } = useContext(AuthContext)
    const [stats, setStats] = useState({
        active_jobs: 0,
        total_candidates: 0,
        shortlisted: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/stats')
            setStats(response.data)
        } catch (error) {
            console.error('Failed to fetch stats', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-700">Active Jobs</h3>
                            <span className="text-3xl">💼</span>
                        </div>
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-10 bg-gray-200 rounded w-16"></div>
                            </div>
                        ) : (
                            <>
                                <p className="text-4xl font-extrabold text-primary-600">{stats.active_jobs}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {stats.active_jobs === 0 ? 'No jobs posted yet' : 'Currently hiring'}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-700">Total Candidates</h3>
                            <span className="text-3xl">👥</span>
                        </div>
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-10 bg-gray-200 rounded w-16"></div>
                            </div>
                        ) : (
                            <>
                                <p className="text-4xl font-extrabold text-primary-600">{stats.total_candidates}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {stats.total_candidates === 0 ? 'Start screening resumes' : 'Applications received'}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-700">Shortlisted</h3>
                            <span className="text-3xl">⭐</span>
                        </div>
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-10 bg-gray-200 rounded w-16"></div>
                            </div>
                        ) : (
                            <>
                                <p className="text-4xl font-extrabold text-primary-600">{stats.shortlisted}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {stats.shortlisted === 0 ? 'Top candidates' : 'Ready for interview'}
                                </p>
                            </>
                        )}
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
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Dashboard
