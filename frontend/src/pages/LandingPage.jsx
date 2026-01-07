import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Ultra-Modern Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
                    ? 'backdrop-blur-2xl bg-white/90 shadow-2xl border-b border-white/40 py-3'
                    : 'backdrop-blur-lg bg-white/70 border-b border-white/20 py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className={`bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'
                                }`}>
                                <span className={`text-white font-bold transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'
                                    }`}>R</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-500 ${scrolled ? 'text-xl' : 'text-2xl'
                                    }`}>
                                    Recrux
                                </span>
                                {!scrolled && (
                                    <span className="text-xs text-gray-500 font-medium -mt-1">
                                        AI Recruitment
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex gap-1 items-center bg-white/40 backdrop-blur-sm rounded-full px-2 py-2 border border-white/30">
                            <a href="#features" className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-full hover:bg-white/60 transition-all duration-300">
                                Features
                            </a>
                            <a href="#how-it-works" className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-full hover:bg-white/60 transition-all duration-300">
                                How It Works
                            </a>
                            <a href="#faq" className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-full hover:bg-white/60 transition-all duration-300">
                                FAQ
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3">
                            <Link
                                to="/login"
                                className="px-6 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Scroll Animations */}
            <section className="pt-40 pb-24 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Badge - Fade in from top */}
                    <div className="inline-block mb-8 px-5 py-2.5 backdrop-blur-sm bg-white/70 rounded-full border border-white/30 shadow-sm animate-fade-in-down">
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            AI-Powered Recruitment Platform
                        </span>
                    </div>

                    {/* Main Heading - Scale in */}
                    <h1 className="text-7xl md:text-8xl font-extrabold mb-6 leading-tight animate-scale-in">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Recrux
                        </span>
                    </h1>

                    {/* Tagline - Fade in */}
                    <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 animate-fade-in">
                        Find Perfect Talent, Instantly
                    </p>

                    {/* Description - Fade in delayed */}
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
                        Transform your recruitment with AI-powered resume screening and intelligent candidate ranking.
                        Reduce hiring time by 70% with semantic search technology.
                    </p>

                    {/* CTA Buttons - Slide in from bottom */}
                    <div className="flex gap-4 justify-center flex-wrap mb-8 animate-slide-up">
                        <Link
                            to="/signup"
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Start Free Trial
                        </Link>
                        <button className="px-10 py-4 backdrop-blur-sm bg-white/70 text-gray-900 rounded-full font-semibold text-lg border border-white/30 hover:bg-white/90 hover:shadow-xl transition-all duration-300 hover:scale-105">
                            Watch Demo
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-8 text-sm text-gray-500 animate-fade-in-up">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>14-day free trial</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section with Scroll Reveal */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 scroll-reveal">
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Intelligent Hiring, Simplified
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful AI features designed to streamline your recruitment workflow
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="scroll-reveal group backdrop-blur-xl bg-white/40 rounded-2xl border border-white/20 p-8 hover:bg-white/70 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works with Scroll Animations */}
            <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20 scroll-reveal">
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get started in minutes with our streamlined workflow
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {steps.map((item, idx) => (
                            <div key={idx} className="relative scroll-reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
                                <div className="backdrop-blur-xl bg-white/50 rounded-2xl border border-white/30 p-8 hover:bg-white/70 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                    <div className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                {idx < 3 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section with Scroll Reveal */}
            <section id="faq" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20 scroll-reveal">
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to know about Recrux
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                <FAQItem faq={faq} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto scroll-reveal">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-3xl opacity-20"></div>
                        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-3xl border border-white/30 shadow-2xl p-16 text-center hover:shadow-3xl transition-all duration-500">
                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                Ready to Transform Your Hiring?
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                                Join innovative companies using AI to find the best talent faster
                            </p>
                            <Link
                                to="/signup"
                                className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                Start Your Free Trial
                            </Link>
                            <p className="mt-6 text-sm text-gray-500">
                                No credit card required • 14-day free trial
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 backdrop-blur-md bg-white/70 border-t border-white/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Recrux
                            </span>
                        </div>
                        <div className="flex gap-8 text-gray-600">
                            <a href="#features" className="hover:text-blue-600 transition-all duration-300 hover:scale-105">Features</a>
                            <a href="#how-it-works" className="hover:text-blue-600 transition-all duration-300 hover:scale-105">How It Works</a>
                            <a href="#faq" className="hover:text-blue-600 transition-all duration-300 hover:scale-105">FAQ</a>
                            <a href="#" className="hover:text-blue-600 transition-all duration-300 hover:scale-105">Privacy</a>
                            <a href="#" className="hover:text-blue-600 transition-all duration-300 hover:scale-105">Terms</a>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2026 Recrux. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-down {
                    animation: fadeInDown 0.8s ease-out;
                }

                .animate-scale-in {
                    animation: scaleIn 0.8s ease-out 0.2s both;
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out 0.4s both;
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out 0.6s both;
                }

                .animate-slide-up {
                    animation: slideUp 0.8s ease-out 0.8s both;
                }

                .scroll-reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                }

                .scroll-reveal.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

            <ScrollReveal />
        </div>
    )
}

// Scroll Reveal Component
const ScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                    }
                })
            },
            { threshold: 0.1 }
        )

        document.querySelectorAll('.scroll-reveal').forEach((el) => {
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return null
}

const FAQItem = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="backdrop-blur-xl bg-white/50 rounded-2xl border border-white/30 overflow-hidden hover:bg-white/70 hover:shadow-xl transition-all duration-500">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/30 transition-all duration-300"
            >
                <span className="text-xl font-bold text-gray-900 pr-8">{faq.question}</span>
                <span className={`text-3xl text-blue-600 transition-all duration-500 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="px-8 py-6 bg-white/30 border-t border-white/30">
                    <p className="text-lg text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
            </div>
        </div>
    )
}

const features = [
    {
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        title: 'AI-Powered Screening',
        description: 'Automatically parse and evaluate resumes with advanced natural language processing. Get detailed candidate scores and insights instantly.'
    },
    {
        icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        title: 'Semantic Talent Search',
        description: 'Discover qualified candidates across your entire talent pool using RAG-based vector search. Find perfect matches beyond keyword matching.'
    },
    {
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        title: 'Smart Analytics',
        description: 'Track hiring metrics, candidate pipelines, and team performance. Make data-driven decisions with comprehensive insights.'
    },
    {
        icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
        title: 'Intelligent Ranking',
        description: 'Candidates automatically ranked by AI match score with detailed, explainable insights for every decision.'
    },
    {
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
        title: 'Centralized Dashboard',
        description: 'Manage all your job postings, candidates, and hiring workflows in one beautiful, intuitive interface.'
    },
    {
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        title: 'Multi-Tenant Secure',
        description: 'Enterprise-grade security with complete data isolation, encryption, and compliance with GDPR standards.'
    }
]

const steps = [
    { title: 'Create Job Posting', description: 'Define requirements and skills for your open position' },
    { title: 'Upload Resumes', description: 'Bulk upload resumes in any format (PDF, DOCX, TXT)' },
    { title: 'AI Screening', description: 'Automatic parsing, evaluation, and intelligent ranking' },
    { title: 'Hire Top Talent', description: 'Review ranked candidates and make informed decisions' }
]

const faqs = [
    {
        question: 'How does Recrux screen resumes?',
        answer: 'Recrux uses advanced AI with natural language processing to automatically parse resumes, extract structured data (skills, experience, education), and score candidates against your job requirements. The screening is done using direct LLM evaluation for accuracy and speed.'
    },
    {
        question: 'What is RAG and how is it used in Recrux?',
        answer: 'RAG (Retrieval-Augmented Generation) is used specifically in our Talent Pool Search feature. It enables semantic search across all your candidates using vector embeddings, allowing you to find qualified candidates from previous job postings based on meaning and context, not just keywords.'
    },
    {
        question: 'What file formats are supported for resume uploads?',
        answer: 'Recrux supports all common resume formats including PDF, DOCX, DOC, and TXT files. Our AI can accurately parse resumes regardless of formatting, layout, or structure, ensuring no candidate is missed.'
    },
    {
        question: 'How is my company data kept secure?',
        answer: 'We implement enterprise-grade security with multi-tenant architecture ensuring complete data isolation. All data is encrypted in transit and at rest, stored in secure cloud infrastructure, and we are fully GDPR compliant. Each company\'s data is completely isolated with tenant-based access control.'
    },
    {
        question: 'Does Recrux integrate with existing ATS systems?',
        answer: 'Currently, Recrux is a standalone platform designed to work independently. However, you can easily export candidate data and use our platform alongside your existing tools. We\'re actively working on integrations for future releases.'
    },
    {
        question: 'How accurate is the AI matching?',
        answer: 'Our AI achieves 92%+ accuracy in candidate matching and resume parsing. The system understands context, synonyms, and related skills, ensuring you don\'t miss qualified candidates due to different terminology or formatting variations.'
    }
]

export default LandingPage
