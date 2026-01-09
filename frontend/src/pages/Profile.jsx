import { useState, useEffect } from 'react'
import api from '../api'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [avatar, setAvatar] = useState('')
    const [theme, setTheme] = useState('')
    const navigate = useNavigate()

    const avatars = ["🐶", "🐱", "🦊", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🦄", "🐙"]
    const themes = [
        { id: 'sage', name: 'Sage Green', color: '#9CAF88' },
        { id: 'rose', name: 'Soft Rose', color: '#D18888' },
        { id: 'ocean', name: 'Ocean Blue', color: '#88B0C8' },
        { id: 'sunset', name: 'Sunset Orange', color: '#E8A87C' }
    ]

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const res = await api.get('/users/me')
            setUser(res.data)
            setAvatar(res.data.avatar_url || "🐶")
            setTheme(res.data.theme_color || "sage")
        } catch (err) {
            console.error(err)
        }
    }

    const handleSave = async () => {
        try {
            await api.put('/users/me', { avatar_url: avatar, theme_color: theme })
            // Force reload to apply theme changes globally if needed, or just navigate
            window.location.href = '/dashboard'
        } catch (err) {
            alert('Failed to update profile')
        }
    }

    if (!user) return <div className="p-8 text-center">Loading...</div>

    return (
        <div className="min-h-screen p-6 pb-24 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-deep-charcoal mb-8">Customize Profile 🎨</h1>

            <div className="w-full max-w-2xl space-y-8">
                {/* Avatar Selection */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass p-8 rounded-2xl"
                >
                    <h2 className="text-xl font-semibold mb-6 text-deep-charcoal">Choose your Avatar</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                        {avatars.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAvatar(a)}
                                className={`text-4xl p-4 rounded-xl transition transform hover:scale-110 ${avatar === a ? 'bg-white shadow-md ring-2 ring-sage-green' : 'hover:bg-white/50'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Theme Selection */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-2xl"
                >
                    <h2 className="text-xl font-semibold mb-6 text-deep-charcoal">Pick a Theme</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`p-4 rounded-xl flex items-center gap-3 transition ${theme === t.id ? 'bg-white shadow-md ring-2 ring-sage-green' : 'hover:bg-white/50'}`}
                            >
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: t.color }}></div>
                                <span className="font-medium text-slate-700">{t.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-deep-charcoal text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}
