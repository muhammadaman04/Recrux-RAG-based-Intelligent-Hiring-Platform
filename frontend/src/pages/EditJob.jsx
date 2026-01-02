import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

const EditJob = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        must_have_skills: [],
        nice_to_have_skills: [],
        min_experience: 0
    })

    useEffect(() => {
        fetchJob()
    }, [jobId])

    const fetchJob = async () => {
        try {
            const response = await api.get(`/jobs/${jobId}`)
            setFormData(response.data)
        } catch (error) {
            console.error('Failed to fetch job', error)
            alert('Failed to load job details')
            navigate('/jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            await api.put(`/jobs/${jobId}`, formData)
            alert('Job updated successfully!')
            navigate('/jobs')
        } catch (error) {
            console.error('Failed to update job', error)
            alert('Failed to update job. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSkillsChange = (e, field) => {
        const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s)
        setFormData(prev => ({
            ...prev,
            [field]: skills
        }))
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
                    <p className="text-gray-600 mt-1">Update job posting details</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                    {/* Job Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., Senior Python Developer"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Describe the role, responsibilities, and requirements..."
                        />
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Requirements
                        </label>
                        <textarea
                            name="requirements"
                            value={formData.requirements || ''}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Additional requirements..."
                        />
                    </div>

                    {/* Must-Have Skills */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Must-Have Skills * (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.must_have_skills.join(', ')}
                            onChange={(e) => handleSkillsChange(e, 'must_have_skills')}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., Python, FastAPI, PostgreSQL, AWS"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Current: {formData.must_have_skills.length} skills
                        </p>
                    </div>

                    {/* Nice-to-Have Skills */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nice-to-Have Skills (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.nice_to_have_skills.join(', ')}
                            onChange={(e) => handleSkillsChange(e, 'nice_to_have_skills')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., Docker, Kubernetes, Redis"
                        />
                    </div>

                    {/* Minimum Experience */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Minimum Experience (years) *
                        </label>
                        <input
                            type="number"
                            name="min_experience"
                            value={formData.min_experience}
                            onChange={handleChange}
                            required
                            min="0"
                            max="30"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Updating...' : 'Update Job'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/jobs')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default EditJob
