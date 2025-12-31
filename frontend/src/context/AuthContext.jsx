import { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            setUser(JSON.parse(userData))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        const { access_token, user } = response.data

        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)

        return user
    }

    const register = async (company_name, email, password, full_name) => {
        const response = await api.post('/auth/register', {
            company_name,
            email,
            password,
            full_name
        })
        const { access_token, user } = response.data

        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)

        return user
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
