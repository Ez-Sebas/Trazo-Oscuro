import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { Index } from './pages/Index.jsx'
import { QuienesSomos } from './pages/QuienesSomos.jsx'
import { Contacto } from './pages/Contacto.jsx'
import { Login } from './pages/Login.jsx'

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/contacto" element={<Contacto />} />
            </Route>

            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default App