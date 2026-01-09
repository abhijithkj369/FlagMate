import { useState, useEffect } from 'react'
import api from '../api'
import { motion } from 'framer-motion'

export default function LoveNotes() {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes')
            setNotes(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newNote.trim()) return

        try {
            const res = await api.post('/notes', { content: newNote })
            // Optimistically add to list if it was sent to self (which it isn't, but for UI feedback)
            // Actually, notes endpoint returns notes sent TO me. So I won't see sent notes immediately in the list unless I also fetch sent notes.
            // For now, just clear input and show success.
            setNewNote('')
            alert('Note sent with love! 💌')
        } catch (err) {
            alert('Failed to send note. Are you linked?')
        }
    }

    return (
        <div className="min-h-screen p-6 pb-24">
            <h1 className="text-3xl font-bold text-deep-charcoal mb-8 text-center">Love Notes 💌</h1>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Send Note Section */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass p-6 rounded-2xl h-fit"
                >
                    <h2 className="text-xl font-semibold mb-4 text-sage-green">Send a Note</h2>
                    <form onSubmit={handleSend}>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-sage-green resize-none h-32 mb-4 placeholder-slate-400"
                            placeholder="Write something sweet..."
                        />
                        <button
                            type="submit"
                            className="w-full bg-sage-green text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg transform hover:scale-[1.02]"
                        >
                            Send Love Note
                        </button>
                    </form>
                </motion.div>

                {/* Received Notes Grid */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-rose-red mb-4">Received Notes</h2>
                    {loading ? (
                        <p>Loading sweet nothings...</p>
                    ) : notes.length === 0 ? (
                        <p className="text-slate-500 italic">No notes yet. Ask your partner to send one!</p>
                    ) : (
                        <div className="grid gap-4">
                            {notes.map((note, i) => (
                                <motion.div
                                    key={note.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-yellow-100 p-4 rounded-xl shadow-md rotate-1 hover:rotate-0 transition-transform duration-300"
                                    style={{ backgroundColor: ['#fff7ed', '#fef3c7', '#ecfccb'][i % 3] }}
                                >
                                    <p className="text-deep-charcoal font-handwriting text-lg">{note.content}</p>
                                    <p className="text-xs text-slate-400 mt-2 text-right">
                                        {new Date(note.created_at).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
