import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import FlagInput from '../components/FlagInput'
import { motion } from 'framer-motion'

export default function LogFlags() {
    const [greenFlags, setGreenFlags] = useState([])
    const [redFlags, setRedFlags] = useState([])
    const [mood, setMood] = useState(5)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            await api.post('/logs', {
                date: new Date().toISOString().split('T')[0],
                green_flags: greenFlags,
                red_flags: redFlags,
                mood: mood
            })
            navigate('/dashboard')
        } catch (err) {
            console.error('Failed to submit log', err)
        }
    }

    const getMoodEmoji = (m) => {
        if (m >= 9) return "🥰"
        if (m >= 7) return "🙂"
        if (m >= 5) return "😐"
        if (m >= 3) return "😤"
        return "🤬"
    }

    return (
        <div className="min-h-screen p-6 flex flex-col items-center pb-24">
            <h1 className="text-3xl font-bold text-deep-charcoal mb-8">Log Today's Vibe ✨</h1>

            <div className="w-full max-w-4xl space-y-8">
                {/* Mood Slider */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass p-8 rounded-2xl text-center"
                >
                    <h2 className="text-xl font-semibold mb-6 text-deep-charcoal">How are you feeling about the relationship today?</h2>
                    <div className="flex items-center gap-4 max-w-lg mx-auto">
                        <span className="text-4xl transition-all transform hover:scale-110">{getMoodEmoji(mood)}</span>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={mood}
                            onChange={(e) => setMood(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-green"
                        />
                        <span className="text-2xl font-bold text-sage-green w-8">{mood}</span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Green Flags Section */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-6 rounded-2xl border-t-4 border-sage-green"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-sage-green">Green Flags (Positives)</h2>
                        <FlagInput type="green" onAdd={(flag) => setGreenFlags([...greenFlags, flag])} />

                        <ul className="mt-4 space-y-2">
                            {greenFlags.map((flag, i) => (
                                <li key={i} className="flex justify-between items-center bg-sage-light/50 p-3 rounded-xl text-deep-charcoal">
                                    <span>{flag}</span>
                                    <button onClick={() => setGreenFlags(greenFlags.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-rose-red">×</button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Red Flags Section */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-6 rounded-2xl border-t-4 border-rose-red"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-rose-red">Red Flags (Negatives)</h2>
                        <FlagInput type="red" onAdd={(flag) => setRedFlags([...redFlags, flag])} />

                        <ul className="mt-4 space-y-2">
                            {redFlags.map((flag, i) => (
                                <li key={i} className="flex justify-between items-center bg-rose-light/50 p-3 rounded-xl text-deep-charcoal">
                                    <span>{flag}</span>
                                    <button onClick={() => setRedFlags(redFlags.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-rose-red">×</button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-deep-charcoal text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg transform hover:scale-[1.01]"
                >
                    Submit Daily Log
                </button>
            </div>
        </div>
    )
}
