import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sage-light to-rose-light p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
            >
                <h1 className="text-5xl font-bold text-slate-800 mb-6">FlagMate</h1>
                <p className="text-xl text-slate-600 mb-8">
                    Track habits. Improve together. See your relationship health in a heatmap.
                </p>

                <div className="space-x-4">
                    <Link to="/login" className="px-6 py-3 bg-sage-green text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-3 bg-white text-sage-green border-2 border-sage-green rounded-lg font-semibold hover:bg-slate-50 transition">
                        Register
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
