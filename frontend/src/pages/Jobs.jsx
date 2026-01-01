import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'
import { AuthContext } from '../context/AuthContext'

const Jobs = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs')
            setJobs(response.data)
        } catch (error) {
            console.error('Failed to fetch jobs', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
                    <p className="text-gray-600 mt-1">Manage your job openings</p>
                </div>
                <Link
                    to="/jobs/create"
                    className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                    + Create Job
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs yet</h3>
                    <p className="text-gray-500 mb-6">Create your first job posting to start screening candidates</p>
                    <Link
                        to="/jobs/create"
                        className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                    >
                        Create First Job
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                    {job.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {job.must_have_skills.slice(0, 5).map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">
                                        {skill}
                                    </span>
                                ))}
                                {job.must_have_skills.length > 5 && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                                        +{job.must_have_skills.length - 5} more
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-6 text-sm text-gray-500">
                                <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
                                <span>Experience: {job.min_experience}+ years</span>
                                <span>Skills: {job.must_have_skills.length} required</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}

export default Jobs
