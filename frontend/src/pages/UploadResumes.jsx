import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

const UploadResumes = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [jobTitle, setJobTitle] = useState('')
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [results, setResults] = useState(null)
    const [loadingJob, setLoadingJob] = useState(true)

    useEffect(() => {
        fetchJobDetails()
    }, [jobId])

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${jobId}`)
            setJobTitle(response.data.title)
        } catch (error) {
            console.error('Failed to fetch job', error)
            alert('Failed to load job details')
            navigate('/jobs')
        } finally {
            setLoadingJob(false)
        }
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        // Append new files to existing ones instead of replacing
        setFiles(prevFiles => [...prevFiles, ...selectedFiles])
        // Clear the input so the same file can be selected again if needed
        e.target.value = ''
    }

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            alert('Please select at least one resume')
            return
        }

        setUploading(true)
        setProgress(0)

        const formData = new FormData()
        files.forEach(file => formData.append('resumes', file))

        try {
            const response = await api.post(
                `/candidates/jobs/${jobId}/upload-resumes`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        setProgress(percentCompleted)
                    }
                }
            )

            setResults(response.data)

            // Auto-navigate to candidates page after 3 seconds
            setTimeout(() => {
                navigate(`/jobs/${jobId}/candidates`)
            }, 3000)

        } catch (error) {
            console.error('Upload failed', error)
            alert('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    if (loadingJob) {
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
                    <h1 className="text-3xl font-bold text-gray-900">📤 Upload Resumes</h1>
                    <p className="text-gray-600 mt-1">Upload candidate resumes for: <span className="font-semibold">{jobTitle}</span></p>
                </div>

                {/* File Upload Section */}
                <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <label className="mt-4 block">
                            <span className="sr-only">Choose resume files</span>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  cursor-pointer"
                            />
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                            PDF, DOC, or DOCX files only. You can select multiple files.
                        </p>
                    </div>

                    {/* Selected Files List */}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                📋 Selected Files ({files.length})
                            </h3>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {files.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(idx)}
                                            disabled={uploading}
                                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Processing resumes...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-primary h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                ⏳ AI is parsing and scoring resumes. This may take a moment...
                            </p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || uploading}
                        className="mt-6 w-full bg-gradient-primary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing {files.length} resumes...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload & Score {files.length} Resume{files.length !== 1 ? 's' : ''}
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">✅ Processing Complete!</h2>
                            <p className="text-gray-600 mt-2">AI has analyzed and scored all resumes</p>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-blue-600">{results.summary?.total || 0}</p>
                                <p className="text-sm text-gray-600">Total</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-green-600">{results.summary?.success || 0}</p>
                                <p className="text-sm text-gray-600">Success</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-red-600">{results.summary?.failed || 0}</p>
                                <p className="text-sm text-gray-600">Failed</p>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                            {results.results?.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded border ${result.status === 'success'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold">{result.name || result.filename}</span>
                                            {result.status === 'success' && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    ({result.recommendation})
                                                </span>
                                            )}
                                        </div>
                                        {result.status === 'success' ? (
                                            <span className="text-green-600 font-bold">
                                                Score: {result.score}/100
                                            </span>
                                        ) : (
                                            <span className="text-red-600 text-sm">
                                                Error: {result.error}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(`/jobs/${jobId}/candidates`)}
                                className="flex-1 bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                            >
                                View Ranked Candidates →
                            </button>
                            <button
                                onClick={() => {
                                    setFiles([])
                                    setResults(null)
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Upload More
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default UploadResumes
