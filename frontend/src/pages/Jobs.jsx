import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'
import { AuthContext } from '../context/AuthContext'

const Jobs = () => {
    const [jobs, setJobs] = useState([])
    const [candidateCounts, setCandidateCounts] = useState({})
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs')
            const jobsData = response.data
            setJobs(jobsData)

            // Fetch candidate count for each job
            const counts = {}
            await Promise.all(
                jobsData.map(async (job) => {
                    try {
                        const candidatesResponse = await api.get(`/candidates/jobs/${job.id}/candidates`)
                        counts[job.id] = candidatesResponse.data.total || 0
                    } catch (error) {
                        console.error(`Failed to fetch candidates for job ${job.id}`, error)
                        counts[job.id] = 0
                    }
                })
            )
            setCandidateCounts(counts)
        } catch (error) {
            console.error('Failed to fetch jobs', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (jobId, jobTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
            return
        }

        try {
            await api.delete(`/jobs/${jobId}`)
            // Remove job from state
            setJobs(jobs.filter(job => job.id !== jobId))
            alert('Job deleted successfully')
        } catch (error) {
            console.error('Failed to delete job', error)
            alert('Failed to delete job. Please try again.')
        }
    }

    const handleEdit = (jobId) => {
        navigate(`/jobs/${jobId}/edit`)
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
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                        {job.status}
                                    </span>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEdit(job.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Edit job"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(job.id, job.title)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete job"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
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

                            <div className="flex justify-between items-center">
                                <div className="flex gap-6 text-sm text-gray-500">
                                    <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
                                    <span>Experience: {job.min_experience}+ years</span>
                                    <span>Skills: {job.must_have_skills.length} required</span>

                                    {/* Candidate Count Badge */}
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-semibold text-primary-600">
                                            {candidateCounts[job.id] || 0} candidates
                                        </span>
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {/* View Candidates Button */}
                                    <Link
                                        to={`/jobs/${job.id}/candidates`}
                                        className="bg-white border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        View Candidates
                                    </Link>

                                    {/* Upload Resumes Button */}
                                    <Link
                                        to={`/jobs/${job.id}/upload`}
                                        className="bg-gradient-primary text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Upload Resumes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}

export default Jobs
