import { useState, useEffect } from 'react'
import api from '../api'

export default function FlagInput({ type, onAdd }) {
    const [input, setInput] = useState('')
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        if (input.length > 1) {
            const fetchSuggestions = async () => {
                try {
                    const res = await api.get(`/recommendations?query=${input}`)
                    setSuggestions(res.data)
                } catch (err) {
                    console.error(err)
                }
            }
            const timeoutId = setTimeout(fetchSuggestions, 300)
            return () => clearTimeout(timeoutId)
        } else {
            setSuggestions([])
        }
    }, [input])

    const handleAdd = (val) => {
        if (val.trim()) {
            onAdd(val)
            setInput('')
            setSuggestions([])
        }
    }

    return (
        <div className="relative">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(input)}
                    placeholder={`Add ${type} flag...`}
                    className={`w-full p-3 rounded-lg border-2 focus:outline-none ${type === 'green'
                            ? 'border-sage-light focus:border-sage-green'
                            : 'border-rose-light focus:border-rose-red'
                        }`}
                />
                <button
                    onClick={() => handleAdd(input)}
                    className={`px-4 rounded-lg text-white font-bold ${type === 'green' ? 'bg-sage-green' : 'bg-rose-red'
                        }`}
                >
                    +
                </button>
            </div>

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-40 overflow-auto">
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onClick={() => handleAdd(s)}
                            className="p-2 hover:bg-slate-100 cursor-pointer text-slate-700"
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
