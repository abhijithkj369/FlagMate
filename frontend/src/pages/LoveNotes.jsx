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
            // In a real app, we'd fetch conversation (sent + received). 
            // For now, let's just fetch received notes and maybe we can't see sent ones easily without a new endpoint.
            // Wait, the plan didn't add a conversation endpoint. 
            // Let's stick to the plan: "Redesign list as a chat window".
            // To make it look like chat, we really need both sides.
            // I'll assume for now we only see what we RECEIVED (left side) and what we SEND (optimistically added to right side).
            // Actually, let's fetch received notes.
            const res = await api.get('/notes')
            // We need to sort by date.
            const sorted = res.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            setNotes(sorted)
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
            // Optimistically add a "sent" note to UI? 
            // Since we don't fetch sent notes from backend, this will disappear on refresh.
            // But for the "demo" feel, let's just show a success toast or something.
            // Or better, let's just alert for now as per previous behavior, but in a nicer way?
            // No, user wants chat.
            // I'll add a temporary "sent" object to the list.
            const tempNote = {
                id: Date.now(),
                content: newNote,
                created_at: new Date().toISOString(),
                is_sent_by_me: true // Marker
            }
            setNotes(prev => [...prev, tempNote])
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
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`max-w-[80%] p-3 rounded-2xl ${note.is_sent_by_me
                                        ? 'bg-sage-green text-white self-end rounded-br-none'
                                        : 'bg-white text-deep-charcoal self-start rounded-bl-none shadow-sm'
                                    }`}
                            >
                                <p>{note.content}</p>
                                <p className={`text-[10px] mt-1 ${note.is_sent_by_me ? 'text-sage-light' : 'text-slate-400'}`}>
                                    {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </motion.div>
                        ))}
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
