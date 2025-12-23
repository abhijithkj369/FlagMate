import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('password', password)

            const res = await api.post('/token', formData)
            localStorage.setItem('token', res.data.access_token)
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-sage-light">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Login to FlagMate</h2>
                {error && <div className="bg-rose-light text-rose-red p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sage-green focus:ring focus:ring-sage-green focus:ring-opacity-50 p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sage-green focus:ring focus:ring-sage-green focus:ring-opacity-50 p-2 border"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Don't have an account? <Link to="/register" className="text-sage-green font-semibold">Register</Link>
                </p>
            </div>
        </div>
    )
}
