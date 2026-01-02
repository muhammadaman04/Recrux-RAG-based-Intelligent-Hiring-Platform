import { Link, useLocation } from 'react-router-dom'
import { useSidebar } from '../context/SidebarContext'

const Sidebar = () => {
    const location = useLocation()
    const { isCollapsed, setIsCollapsed } = useSidebar()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Jobs', href: '/jobs', icon: '💼' },
    ]

    return (
        <div
            className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : ''}`}>
                    <span className="text-3xl">🎯</span>
                    <span className="text-2xl font-extrabold text-gradient">Recrux</span>
                </div>
                {isCollapsed && (
                    <span className="text-3xl mx-auto">🎯</span>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all hover:scale-110"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

export default Sidebar
