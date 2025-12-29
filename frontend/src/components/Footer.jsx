import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🎯</span>
                            <span className="text-2xl font-extrabold text-gradient">Recrux</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            AI-powered recruitment that finds the perfect match, every time.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Product</h4>
                        <ul className="space-y-3">
                            <li><a href="#features" className="text-gray-400 hover:text-primary-400 transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors">How It Works</a></li>
                            <li><a href="#pricing" className="text-gray-400 hover:text-primary-400 transition-colors">Pricing</a></li>
                            <li><Link to="/signup" className="text-gray-400 hover:text-primary-400 transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#about" className="text-gray-400 hover:text-primary-400 transition-colors">About Us</a></li>
                            <li><a href="#careers" className="text-gray-400 hover:text-primary-400 transition-colors">Careers</a></li>
                            <li><a href="#blog" className="text-gray-400 hover:text-primary-400 transition-colors">Blog</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#privacy" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#terms" className="text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#security" className="text-gray-400 hover:text-primary-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 Recrux. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-400 hover:text-primary-400 hover:-translate-y-1 transition-all text-xl">
                            𝕏
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-400 hover:-translate-y-1 transition-all text-xl">
                            in
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-400 hover:-translate-y-1 transition-all text-xl">
                            ⚡
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
