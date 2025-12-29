import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Brand Name + Tagline */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-6xl">🎯</span>
                                    <h1 className="text-6xl lg:text-7xl font-extrabold text-gradient">
                                        Recrux
                                    </h1>
                                </div>
                                <p className="text-2xl font-semibold text-gray-700 ml-1">
                                    Hire aptly, hire right
                                </p>
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
                                AI-Powered Recruitment
                                <span className="block mt-2">Made Simple</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Screen 1000+ resumes in minutes, not weeks. Let AI find your perfect candidates with semantic matching and intelligent ranking powered by RAG technology.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/signup" className="bg-gradient-primary text-white font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg inline-flex items-center gap-2">
                                    Start Free Trial
                                    <span className="text-2xl">→</span>
                                </Link>
                                <a href="#how-it-works" className="border-2 border-primary-600 text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 text-lg inline-flex items-center gap-2">
                                    <span className="text-2xl">▶</span>
                                    Watch Demo
                                </a>
                            </div>
                            <div className="mt-8 flex items-center gap-8 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>14-day free trial</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm bg-white/90">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">SC</div>
                                            <div>
                                                <div className="font-bold text-gray-900">Sarah Chen</div>
                                                <div className="text-sm text-gray-600">Senior React Developer</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-3xl font-extrabold text-gradient">94%</div>
                                            <div className="text-xs text-gray-500">Match Score</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">MJ</div>
                                            <div>
                                                <div className="font-bold text-gray-900">Michael Johnson</div>
                                                <div className="text-sm text-gray-600">Full Stack Engineer</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-3xl font-extrabold text-gradient">89%</div>
                                            <div className="text-xs text-gray-500">Match Score</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 opacity-75 hover:opacity-100 hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">EP</div>
                                            <div>
                                                <div className="font-bold text-gray-900">Emily Parker</div>
                                                <div className="text-sm text-gray-600">Frontend Developer</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-3xl font-extrabold text-gradient">85%</div>
                                            <div className="text-xs text-gray-500">Match Score</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        <span className="text-lg">✨</span>
                                        AI-ranked candidates in real-time
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
                            Powerful Features for <span className="text-gradient">Modern Hiring</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to streamline your recruitment process and find the best talent faster.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 rounded-3xl border-2 border-gray-100 hover:border-primary-300 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group"
                            >
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-primary-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-300 rounded-full filter blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
                            How <span className="text-gradient">Recrux</span> Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Three simple steps to transform your hiring process
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-5xl text-primary-400">
                                        →
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
                            Frequently Asked <span className="text-gradient">Questions</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to know about Recrux
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} faq={faq} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
                            Ready to Transform Your Hiring?
                        </h2>
                        <p className="text-2xl mb-10 text-primary-100">
                            Join hundreds of companies already using Recrux to find their perfect candidates.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-3 bg-white text-primary-600 font-bold px-12 py-5 rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-xl"
                        >
                            Start Your Free Trial
                            <span className="text-2xl">→</span>
                        </Link>
                        <p className="mt-6 text-primary-100 text-lg">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

const FAQItem = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary-300 transition-all"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
            >
                <span className="text-xl font-bold text-gray-900 pr-8">{faq.question}</span>
                <span className={`text-3xl text-primary-600 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
            >
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-lg text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
            </div>
        </motion.div>
    )
}

const features = [
    {
        icon: '🤖',
        title: 'AI Resume Parsing',
        description: 'Automatically extract skills, experience, and education from any resume format with 95%+ accuracy using advanced NLP.'
    },
    {
        icon: '🎯',
        title: 'Semantic Matching',
        description: 'RAG-powered technology finds candidates based on meaning and context, not just keywords, for superior matches.'
    },
    {
        icon: '📊',
        title: 'Intelligent Ranking',
        description: 'Candidates automatically ranked by AI match score with detailed, explainable insights for every decision.'
    },
    {
        icon: '💬',
        title: 'AI Chat Assistant',
        description: 'Ask questions about any candidate and get instant, context-aware answers powered by advanced language models.'
    },
    {
        icon: '🗂️',
        title: 'Talent Pool Search',
        description: 'Search your entire candidate database with natural language queries and find hidden gems instantly.'
    },
    {
        icon: '🔒',
        title: 'Multi-Tenant Secure',
        description: 'Enterprise-grade security with complete data isolation, encryption, and compliance with GDPR standards.'
    }
]

const steps = [
    {
        title: 'Create Job Posting',
        description: 'Simply paste your job description and let our AI automatically extract requirements, must-have skills, and qualifications in seconds.'
    },
    {
        title: 'Upload Resumes',
        description: 'Bulk upload 100+ resumes in any format. Our AI instantly parses and indexes them in your secure, searchable talent pool.'
    },
    {
        title: 'Get Ranked Candidates',
        description: 'View candidates ranked by AI match score with detailed explanations, strengths, weaknesses, and tailored interview questions.'
    }
]

const faqs = [
    {
        question: 'How does Recrux use AI to screen resumes?',
        answer: 'Recrux uses advanced RAG (Retrieval-Augmented Generation) technology powered by large language models. We parse resumes to extract structured data, generate semantic embeddings, and use vector similarity search to match candidates to job requirements based on meaning, not just keywords. This results in more accurate matches and reduces bias.'
    },
    {
        question: 'What file formats are supported for resume uploads?',
        answer: 'Recrux supports all common resume formats including PDF, DOCX, DOC, and TXT files. Our AI can accurately parse resumes regardless of formatting, layout, or structure, ensuring no candidate is missed due to technical limitations.'
    },
    {
        question: 'How is my company data kept secure?',
        answer: 'We implement enterprise-grade security with multi-tenant architecture ensuring complete data isolation. All data is encrypted in transit and at rest, stored in secure cloud infrastructure, and we are fully GDPR compliant. Each company\'s data is stored in isolated namespaces with row-level security policies.'
    },
    {
        question: 'Can I integrate Recrux with my existing ATS?',
        answer: 'Yes! Recrux provides a comprehensive REST API that allows seamless integration with popular Applicant Tracking Systems (ATS) and HR platforms. Our team can help you set up custom integrations to fit your workflow.'
    },
    {
        question: 'What makes Recrux different from other recruitment tools?',
        answer: 'Unlike traditional keyword-based screening tools, Recrux uses semantic understanding to truly comprehend candidate qualifications and job requirements. Our RAG technology provides explainable AI decisions, showing exactly why each candidate matches. Plus, our AI chat feature lets you ask questions about candidates in natural language.'
    },
    {
        question: 'How accurate is the AI matching?',
        answer: 'Our AI achieves 92%+ accuracy in candidate matching, significantly outperforming traditional keyword-based systems. The semantic matching technology understands context, synonyms, and related skills, ensuring you don\'t miss qualified candidates due to different terminology.'
    }
]

export default LandingPage
