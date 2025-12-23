import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Heatmap from '../components/Heatmap'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [partnerCode, setPartnerCode] = useState('')
    const [linkError, setLinkError] = useState('')
    const [linkSuccess, setLinkSuccess] = useState('')
    const [logs, setLogs] = useState([])

    useEffect(() => {
        fetchUser()
        // Mock logs for now or fetch real logs
        setLogs([
            { date: '2023-12-20', score: 8 },
            { date: '2023-12-21', score: -3 },
            { date: '2023-12-22', score: 5 },
        ])
    }, [])

    const fetchUser = async () => {
        try {
            const res = await api.get('/users/me')
            setUser(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleLinkPartner = async (e) => {
        e.preventDefault()
        try {
            await api.post('/link-partner', { link_code: partnerCode })
            setLinkSuccess('Partner linked successfully!')
            fetchUser()
        } catch (err) {
            setLinkError('Invalid code or already linked')
        }
    }

    if (!user) return <div className="p-8 text-center">Loading...</div>

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.username}</h1>
                <Link to="/log" className="bg-sage-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition shadow-md">
                    + Log Today
                </Link>
            </header>

            {!user.partner_id ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">Link with your Partner</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-sage-light p-4 rounded-lg text-center">
                            <p className="text-sm text-slate-600 mb-2">Your Link Code</p>
                            <p className="text-2xl font-mono font-bold text-sage-green tracking-wider">{user.link_code}</p>
                            <p className="text-xs text-slate-500 mt-2">Share this with your partner</p>
                        </div>
                        <div>
                            <form onSubmit={handleLinkPartner} className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Enter Partner's Code</label>
                                <input
                                    type="text"
                                    value={partnerCode}
                                    onChange={(e) => setPartnerCode(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-sage-green focus:border-sage-green"
                                    placeholder="e.g. ABC123"
                                />
                                <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 transition">
                                    Link Accounts
                                </button>
                                {linkError && <p className="text-rose-red text-sm">{linkError}</p>}
                                {linkSuccess && <p className="text-sage-green text-sm">{linkSuccess}</p>}
                            </form>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-slate-700">Love Graph</h2>
                            <Heatmap values={logs} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-slate-700">Daily Summary</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-sage-light rounded-lg border-l-4 border-sage-green">
                                    <h3 className="font-bold text-sage-green">Top Green Flag</h3>
                                    <p className="text-slate-700">"Made coffee this morning"</p>
                                </div>
                                <div className="p-4 bg-rose-light rounded-lg border-l-4 border-rose-red">
                                    <h3 className="font-bold text-rose-red">Needs Focus</h3>
                                    <p className="text-slate-700">"Forgot to take out trash"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
