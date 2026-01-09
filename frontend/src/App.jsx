import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LogFlags from './pages/LogFlags'
import LoveNotes from './pages/LoveNotes'
import Profile from './pages/Profile'
import AuthGuard from './components/AuthGuard'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<AuthGuard />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log" element={<LogFlags />} />
                <Route path="/notes" element={<LoveNotes />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    )
}

export default App
