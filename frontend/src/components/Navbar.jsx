import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
                    : 'bg-white/80 backdrop-blur-sm'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-4xl">🎯</span>
                        <span className="text-2xl font-extrabold text-gradient group-hover:scale-105 transition-transform">
                            Recrux
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
                            Features
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
                            How It Works
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="#faq" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
                            FAQ
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-primary-600 font-semibold px-5 py-2 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
