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
    const [partnerLogs, setPartnerLogs] = useState([])
    const [logs, setLogs] = useState([])

    useEffect(() => {
        fetchUser()
        fetchPartnerLogs()
    }, [])

    const fetchUser = async () => {
        try {
            const res = await api.get('/users/me')
            setUser(res.data)
            // Mock logs for now or fetch real logs
            setLogs([
                { date: '2023-12-20', score: 8 },
                { date: '2023-12-21', score: -3 },
                { date: '2023-12-22', score: 5 },
            ])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchPartnerLogs = async () => {
        try {
            const res = await api.get('/logs/partner')
            setPartnerLogs(res.data)
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

    if (!user) return <div className="p-8 text-center text-deep-charcoal">Loading...</div>

    return (
        <div className="min-h-screen p-6 pb-24">
            <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link to="/profile" className="text-4xl hover:scale-110 transition" title="Edit Profile">
                        {user.avatar_url || "🐶"}
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-deep-charcoal">Hi, {user.username}</h1>
                        <p className="text-slate-500">Your relationship at a glance</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link to="/notes" className="bg-white text-rose-red px-4 py-2 rounded-xl hover:bg-rose-50 transition shadow-sm border border-rose-100 font-semibold flex items-center gap-2">
                        💌 Chat
                    </Link>
                    <Link to="/log" className="bg-sage-green text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition shadow-lg font-semibold flex items-center gap-2">
                        + Log Vibe
                    </Link>
                </div>
            </header>

            {!user.partner_id ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-2xl max-w-2xl mx-auto mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4 text-deep-charcoal">Link with your Partner</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/50 p-6 rounded-xl text-center border border-white/40">
                            <p className="text-sm text-slate-600 mb-2">Your Link Code</p>
                            <p className="text-3xl font-mono font-bold text-sage-green tracking-wider">{user.link_code}</p>
                            <p className="text-xs text-slate-500 mt-2">Share this with your partner</p>
                        </div>
                        <div>
                            <form onSubmit={handleLinkPartner} className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Enter Partner's Code</label>
                                <input
                                    type="text"
                                    value={partnerCode}
                                    onChange={(e) => setPartnerCode(e.target.value)}
                                    className="w-full p-3 border-none rounded-xl bg-white/50 focus:ring-2 focus:ring-sage-green placeholder-slate-400"
                                    placeholder="e.g. ABC123"
                                />
                                <button type="submit" className="w-full bg-deep-charcoal text-white py-3 rounded-xl hover:bg-slate-800 transition font-semibold shadow-lg">
                                    Link Accounts
                                </button>
                                {linkError && <p className="text-rose-red text-sm">{linkError}</p>}
                                {linkSuccess && <p className="text-sage-green text-sm">{linkSuccess}</p>}
                            </form>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div className="md:col-span-2 space-y-6">
                        {/* Partner's Vibe Widget */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="glass p-6 rounded-2xl bg-gradient-to-r from-white/60 to-white/30"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-deep-charcoal flex items-center gap-2">
                                Partner's Vibe Check <span className="text-xs bg-rose-100 text-rose-red px-2 py-1 rounded-full">LIVE</span>
                            </h2>
                            {partnerLogs.length > 0 ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl">
                                            {partnerLogs[0].mood >= 8 ? '🥰' : partnerLogs[0].mood >= 5 ? '🙂' : '😤'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-deep-charcoal">They are feeling {partnerLogs[0].mood}/10</p>
                                            <p className="text-sm text-slate-500">Last updated: {partnerLogs[0].date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-sage-green">+{partnerLogs[0].green_flags.length} Green Flags</p>
                                        <p className="text-sm font-semibold text-rose-red">-{partnerLogs[0].red_flags.length} Red Flags</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">Partner hasn't logged anything yet.</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-6 rounded-2xl"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-deep-charcoal">Love Graph</h2>
                            <Heatmap values={logs} />
                        </motion.div>
                    </div>
                    <div className="space-y-6">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="glass p-6 rounded-2xl"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-deep-charcoal">Daily Summary</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-sage-light/50 rounded-xl border-l-4 border-sage-green">
                                    <h3 className="font-bold text-sage-green text-sm uppercase tracking-wide">Top Green Flag</h3>
                                    <p className="text-deep-charcoal mt-1">"Made coffee this morning"</p>
                                </div>
                                <div className="p-4 bg-rose-light/50 rounded-xl border-l-4 border-rose-red">
                                    <h3 className="font-bold text-rose-red text-sm uppercase tracking-wide">Needs Focus</h3>
                                    <p className="text-deep-charcoal mt-1">"Forgot to take out trash"</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="glass p-6 rounded-2xl bg-gradient-to-br from-soft-rose/20 to-white/40"
                        >
                            <h2 className="text-xl font-semibold mb-2 text-deep-charcoal">Relationship Health</h2>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-rose-red">8.5</span>
                                <span className="text-slate-500 mb-1">/ 10</span>
                            </div>
                            <div className="w-full bg-white/50 rounded-full h-2 mt-2">
                                <div className="bg-rose-red h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Based on your recent logs</p>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    )
}
