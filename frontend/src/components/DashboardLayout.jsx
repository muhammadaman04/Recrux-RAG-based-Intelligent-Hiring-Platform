import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Sidebar from './Sidebar'

const DashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [sidebarWidth, setSidebarWidth] = useState(256) // 64 * 4 = 256px (w-64)

    useEffect(() => {
        // Listen for sidebar width changes
        const handleResize = () => {
            const sidebar = document.querySelector('[class*="w-"]')
            if (sidebar) {
                setSidebarWidth(sidebar.offsetWidth)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        // Use MutationObserver to detect sidebar width changes
        const observer = new MutationObserver(handleResize)
        const sidebar = document.querySelector('[class*="w-"]')
        if (sidebar) {
            observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] })
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            observer.disconnect()
        }
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div
                className="flex-1 transition-all duration-300"
                style={{ marginLeft: `${sidebarWidth}px` }}
            >
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.email?.split('@')[0]}
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
