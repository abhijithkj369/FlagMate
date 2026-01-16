import { useState, useEffect, useRef } from 'react'
import api from '../api'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoveNotes() {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        fetchUser()
        fetchNotes()
        const interval = setInterval(fetchNotes, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [notes])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchUser = async () => {
        try {
            const res = await api.get('/users/me')
            setUser(res.data)
        } catch (err) {
            console.error(err)
        }
    }

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
            await api.post('/notes', { content: newNote })
            setNewNote('')
            fetchNotes() // Refresh list to show new message
        } catch (err) {
            alert('Failed to send. Linked?')
        }
    }

    return (
        <div className="min-h-screen p-4 pb-24 flex flex-col max-w-2xl mx-auto">
            <header className="mb-4 text-center">
                <h1 className="text-2xl font-bold text-deep-charcoal">Love Chat 💬</h1>
                <p className="text-xs text-slate-500">Messages disappear after... never.</p>
            </header>

            <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto mb-4 flex flex-col gap-3 h-[60vh]">
                {loading ? (
                    <p className="text-center text-slate-400 mt-10">Loading love letters...</p>
                ) : notes.length === 0 ? (
                    <div className="text-center mt-10 opacity-50">
                        <p className="text-4xl mb-2">🦗</p>
                        <p>It's quiet here. Say something sweet!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notes.map((note) => {
                            const isMe = note.sender_id === user?.id
                            return (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`max-w-[80%] p-3 rounded-2xl ${isMe
                                        ? 'bg-sage-green text-white self-end rounded-br-none'
                                        : 'bg-white text-deep-charcoal self-start rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    <p>{note.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-sage-light' : 'text-slate-400'}`}>
                                        {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 p-4 rounded-xl border-none shadow-lg focus:ring-2 focus:ring-sage-green"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="bg-deep-charcoal text-white p-4 rounded-xl shadow-lg hover:bg-slate-800 transition"
                >
                    ➤
                </button>
            </form>
        </div>
    )
}
