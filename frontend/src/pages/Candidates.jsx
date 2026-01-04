import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

const Candidates = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [candidates, setCandidates] = useState([])
    const [jobTitle, setJobTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [filter, setFilter] = useState('all') // all, shortlisted, rejected, pending

    useEffect(() => {
        fetchCandidates()
    }, [jobId])

    const fetchCandidates = async () => {
        try {
            const response = await api.get(`/candidates/jobs/${jobId}/candidates`)
            setCandidates(response.data.candidates || [])
            setJobTitle(response.data.job_title || 'Job Candidates')
        } catch (error) {
            console.error('Failed to fetch candidates', error)
            alert('Failed to load candidates')
        } finally {
            setLoading(false)
        }
    }

    const updateCandidateStatus = async (candidateId, newStatus) => {
        try {
            await api.patch(`/candidates/${candidateId}/status`, { status: newStatus })

            // Update local state
            setCandidates(candidates.map(c =>
                c.id === candidateId ? { ...c, status: newStatus } : c
            ))

            alert(`Candidate ${newStatus === 'shortlisted' ? 'shortlisted' : 'rejected'} successfully!`)
        } catch (error) {
            console.error('Failed to update status', error)
            alert('Failed to update candidate status')
        }
    }

    const getFilteredCandidates = () => {
        if (filter === 'all') return candidates
        return candidates.filter(c => c.status === filter)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'shortlisted': return 'bg-green-100 text-green-800'
            case 'rejected': return 'bg-red-100 text-red-800'
            case 'screened': return 'bg-blue-100 text-blue-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getRecommendationBadge = (recommendation) => {
        switch (recommendation) {
            case 'hire': return 'bg-green-500 text-white'
            case 'maybe': return 'bg-yellow-500 text-white'
            case 'reject': return 'bg-red-500 text-white'
            default: return 'bg-gray-500 text-white'
        }
    }

    const filteredCandidates = getFilteredCandidates()
    const sortedCandidates = [...filteredCandidates].sort((a, b) => b.match_score - a.match_score)

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="text-primary-600 hover:text-primary-700 mb-2 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Jobs
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{jobTitle}</h1>
                        <p className="text-gray-600 mt-1">
                            {sortedCandidates.length} candidate{sortedCandidates.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All ({candidates.length})
                        </button>
                        <button
                            onClick={() => setFilter('shortlisted')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'shortlisted'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Shortlisted ({candidates.filter(c => c.status === 'shortlisted').length})
                        </button>
                        <button
                            onClick={() => setFilter('screened')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'screened'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pending ({candidates.filter(c => c.status === 'screened').length})
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'rejected'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Rejected ({candidates.filter(c => c.status === 'rejected').length})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : sortedCandidates.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h3>
                        <p className="text-gray-500 mb-6">
                            {filter === 'all'
                                ? 'Upload resumes to start screening candidates'
                                : `No ${filter} candidates`}
                        </p>
                        {filter === 'all' && (
                            <button
                                onClick={() => navigate(`/jobs/${jobId}/upload`)}
                                className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                            >
                                Upload Resumes
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {sortedCandidates.map((candidate, index) => (
                            <div
                                key={candidate.id}
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {/* Rank Badge */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                #{index + 1}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(candidate.status)}`}>
                                                {candidate.status}
                                            </span>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="flex gap-6 text-sm text-gray-600 mb-4">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {candidate.email}
                                            </span>
                                            {candidate.phone && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {candidate.phone}
                                                </span>
                                            )}
                                            {candidate.location && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {candidate.location}
                                                </span>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {candidate.skills_matched?.slice(0, 8).map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">
                                                    {skill}
                                                </span>
                                            ))}
                                            {candidate.skills_matched?.length > 8 && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                                                    +{candidate.skills_matched.length - 8} more
                                                </span>
                                            )}
                                        </div>

                                        {/* AI Evaluation Summary */}
                                        {candidate.ai_evaluation && (
                                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {candidate.strengths && candidate.strengths.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-green-700 mb-2">✅ Strengths</h4>
                                                            <ul className="text-sm text-gray-700 space-y-1">
                                                                {candidate.strengths.slice(0, 3).map((strength, idx) => (
                                                                    <li key={idx}>• {strength}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {candidate.concerns && candidate.concerns.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-red-700 mb-2">⚠️ Concerns</h4>
                                                            <ul className="text-sm text-gray-700 space-y-1">
                                                                {candidate.concerns.slice(0, 3).map((concern, idx) => (
                                                                    <li key={idx}>• {concern}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            {candidate.status !== 'shortlisted' && (
                                                <button
                                                    onClick={() => updateCandidateStatus(candidate.id, 'shortlisted')}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Shortlist
                                                </button>
                                            )}
                                            {candidate.status !== 'rejected' && (
                                                <button
                                                    onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="bg-white border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Score Card */}
                                    <div className="ml-6 text-center">
                                        <div className="bg-gradient-primary text-white p-6 rounded-xl shadow-lg">
                                            <div className="text-4xl font-bold">{candidate.match_score}</div>
                                            <div className="text-sm opacity-90">Match Score</div>
                                        </div>
                                        <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-bold ${getRecommendationBadge(candidate.recommendation)}`}>
                                            {candidate.recommendation?.toUpperCase()}
                                        </div>
                                        {candidate.experience_years > 0 && (
                                            <div className="mt-3 text-sm text-gray-600">
                                                {candidate.experience_years} years exp
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Candidate Detail Modal */}
                {selectedCandidate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                                        <p className="text-gray-600">{selectedCandidate.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCandidate(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Full AI Evaluation */}
                                {selectedCandidate.ai_evaluation && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-bold text-blue-900 mb-2">AI Evaluation Summary</h3>
                                            <p className="text-gray-700">{selectedCandidate.ai_evaluation.explanation || 'No summary available'}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <h3 className="font-bold text-green-900 mb-2">Strengths</h3>
                                                <ul className="text-gray-700 space-y-1">
                                                    {selectedCandidate.strengths?.map((strength, idx) => (
                                                        <li key={idx}>• {strength}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-red-50 p-4 rounded-lg">
                                                <h3 className="font-bold text-red-900 mb-2">Concerns</h3>
                                                <ul className="text-gray-700 space-y-1">
                                                    {selectedCandidate.concerns?.map((concern, idx) => (
                                                        <li key={idx}>• {concern}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-bold text-gray-900 mb-2">Skills Analysis</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-green-700 mb-2">Matched Skills</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedCandidate.skills_matched?.map((skill, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-red-700 mb-2">Missing Skills</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedCandidate.skills_missing?.map((skill, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default Candidates
