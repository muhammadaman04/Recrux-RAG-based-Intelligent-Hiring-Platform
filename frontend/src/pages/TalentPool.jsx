import { useState } from 'react'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

const TalentPool = () => {
    const [query, setQuery] = useState('')
    const [minExperience, setMinExperience] = useState(0)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()

        if (!query.trim()) {
            alert('Please enter a search query')
            return
        }

        setLoading(true)
        setSearched(true)

        try {
            const response = await api.post('/talent-pool/search', {
                query: query.trim(),
                min_experience: minExperience,
                top_k: 20
            })

            setResults(response.data.results || [])
        } catch (error) {
            console.error('Search failed:', error)
            alert('Failed to search talent pool')
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Talent Pool Search</h1>
                    <p className="text-gray-600">
                        Search across all candidates using AI-powered semantic search
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <form onSubmit={handleSearch}>
                        <div className="space-y-4">
                            {/* Search Query */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Search Query
                                </label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., Python developer with AWS experience, Machine Learning engineer, React frontend developer..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Describe the skills, experience, or role you're looking for
                                </p>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Minimum Experience (years)
                                    </label>
                                    <input
                                        type="number"
                                        value={minExperience}
                                        onChange={(e) => setMinExperience(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="30"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Search Talent Pool
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Search Results
                            </h2>
                            <span className="text-gray-600">
                                {results.length} candidate{results.length !== 1 ? 's' : ''} found
                            </span>
                        </div>

                        {results.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h3>
                                <p className="text-gray-500">
                                    Try adjusting your search query or filters
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {results.map((candidate, index) => (
                                    <div
                                        key={candidate.id}
                                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                {/* Header */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                        #{index + 1}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                                                    {candidate.match_score && (
                                                        <span className={`text-lg font-bold ${getScoreColor(candidate.match_score)}`}>
                                                            {candidate.match_score}% Match
                                                        </span>
                                                    )}
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
                                                    {candidate.experience_years > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {candidate.experience_years} years exp
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Skills */}
                                                {candidate.skills_matched && candidate.skills_matched.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {candidate.skills_matched.slice(0, 10).map((skill, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {candidate.skills_matched.length > 10 && (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                                                                +{candidate.skills_matched.length - 10} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Job Info */}
                                                {candidate.job_title && (
                                                    <div className="text-sm text-gray-600">
                                                        Applied for: <span className="font-semibold text-gray-900">{candidate.job_title}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Similarity Score */}
                                            {candidate.similarity_score && (
                                                <div className="ml-6 text-center">
                                                    <div className="bg-gradient-primary text-white p-6 rounded-xl shadow-lg">
                                                        <div className="text-3xl font-bold">
                                                            {Math.round(candidate.similarity_score * 100)}%
                                                        </div>
                                                        <div className="text-sm opacity-90">Similarity</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Help Text */}
                {!searched && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-2">💡 How to use Talent Pool Search</h3>
                        <ul className="text-blue-800 space-y-2">
                            <li>• <strong>Semantic Search:</strong> Describe the role or skills you need in natural language</li>
                            <li>• <strong>Cross-Job Discovery:</strong> Find qualified candidates from all previous job postings</li>
                            <li>• <strong>AI-Powered Matching:</strong> Results are ranked by relevance using vector similarity</li>
                            <li>• <strong>Example queries:</strong> "Python developer with 3+ years", "Machine learning engineer", "Full-stack developer with React and Node.js"</li>
                        </ul>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default TalentPool
