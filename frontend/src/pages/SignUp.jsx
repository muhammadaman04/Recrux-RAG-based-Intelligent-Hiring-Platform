import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SignUp = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                    <span className="text-5xl">🎯</span>
                    <span className="text-3xl font-extrabold text-gradient">Recrux</span>
                </Link>

                {/* SignUp Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                        Create Your Account
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        Start screening smarter today
                    </p>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                placeholder="TechFlow Inc."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Work Email
                            </label>
                            <input
                                type="email"
                                placeholder="hr@company.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label className="text-sm text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-primary-600 hover:underline font-semibold">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-primary-600 hover:underline font-semibold">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-primary-50 rounded-xl p-4 border border-primary-200">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="text-2xl">✨</span>
                        <div>
                            <p className="font-semibold text-gray-900">Start your 14-day free trial</p>
                            <p className="text-gray-600">No credit card required • Cancel anytime</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUp
