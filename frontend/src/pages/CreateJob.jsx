import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

const CreateJob = () => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [extracting, setExtracting] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        must_have_skills: [],
        nice_to_have_skills: [],
        min_experience: 0
    })

    const handleExtractRequirements = async () => {
        if (!formData.description) {
            setError('Please enter job description first')
            return
        }

        setExtracting(true)
        setError('')

        try {
            const response = await api.post('/jobs/extract-requirements', {
                description: formData.description
            })

            setFormData({
                ...formData,
                must_have_skills: response.data.must_have_skills,
                nice_to_have_skills: response.data.nice_to_have_skills,
                min_experience: response.data.min_experience
            })
        } catch (error) {
            setError('Failed to extract requirements. Please try again.')
        } finally {
            setExtracting(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await api.post('/jobs', formData)
            navigate('/jobs')
        } catch (error) {
            setError('Failed to create job. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Create Job Posting</h1>
                <p className="text-gray-600 mb-8">Fill in the details to create a new job opening</p>

                {/* Step Indicator */}
                <div className="flex items-center mb-8">
                    <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                        <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                            1
                        </div>
                        <span className="ml-3 font-semibold">Basic Info</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                        <div className={`h-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'} transition-all duration-300`}></div>
                    </div>
                    <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'} flex items-center justify-center font-bold text-lg`}>
                            2
                        </div>
                        <span className="ml-3 font-semibold">Requirements</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior Python Developer"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={12}
                                    placeholder="Paste the full job description here. Our AI will extract the requirements automatically in the next step."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Tip: Include skills, experience requirements, and responsibilities for better AI extraction
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition"
                            >
                                Next: Add Requirements
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-purple-900 font-medium mb-3">
                                    Use AI to automatically extract requirements from your job description
                                </p>
                                <button
                                    type="button"
                                    onClick={handleExtractRequirements}
                                    disabled={extracting}
                                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {extracting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Extracting with AI...
                                        </span>
                                    ) : (
                                        'Extract Requirements with AI'
                                    )}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Must-Have Skills * (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.must_have_skills.join(', ')}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        must_have_skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                    })}
                                    placeholder="Python, FastAPI, PostgreSQL, Docker"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nice-to-Have Skills (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.nice_to_have_skills.join(', ')}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        nice_to_have_skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                    })}
                                    placeholder="AWS, Kubernetes, Redis"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Minimum Experience (years) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_experience}
                                    onChange={(e) => setFormData({ ...formData, min_experience: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    max="30"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || formData.must_have_skills.length === 0}
                                    className="flex-1 bg-gradient-primary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create Job'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </DashboardLayout>
    )
}

export default CreateJob
