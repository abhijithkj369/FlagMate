import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import FlagInput from '../components/FlagInput'
import { motion } from 'framer-motion'

export default function LogFlags() {
    const [greenFlags, setGreenFlags] = useState([])
    const [redFlags, setRedFlags] = useState([])
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            await api.post('/logs', {
                date: new Date().toISOString().split('T')[0],
                green_flags: greenFlags,
                red_flags: redFlags
            })
            navigate('/dashboard')
        } catch (err) {
            console.error('Failed to submit log', err)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Log Today's Flags</h1>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Green Flags Section */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white p-6 rounded-xl shadow-md border-t-4 border-sage-green"
                >
                    <h2 className="text-xl font-semibold mb-4 text-sage-green">Green Flags (Positives)</h2>
                    <FlagInput type="green" onAdd={(flag) => setGreenFlags([...greenFlags, flag])} />

                    <ul className="mt-4 space-y-2">
                        {greenFlags.map((flag, i) => (
                            <li key={i} className="flex justify-between items-center bg-sage-light p-2 rounded text-slate-700">
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
                    className="bg-white p-6 rounded-xl shadow-md border-t-4 border-rose-red"
                >
                    <h2 className="text-xl font-semibold mb-4 text-rose-red">Red Flags (Negatives)</h2>
                    <FlagInput type="red" onAdd={(flag) => setRedFlags([...redFlags, flag])} />

                    <ul className="mt-4 space-y-2">
                        {redFlags.map((flag, i) => (
                            <li key={i} className="flex justify-between items-center bg-rose-light p-2 rounded text-slate-700">
                                <span>{flag}</span>
                                <button onClick={() => setRedFlags(redFlags.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-rose-red">×</button>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            <button
                onClick={handleSubmit}
                className="mt-8 px-8 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition shadow-lg"
            >
                Submit Daily Log
            </button>
        </div>
    )
}
