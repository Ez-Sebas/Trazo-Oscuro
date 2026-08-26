import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { Index } from './pages/Index.jsx'
import { QuienesSomos } from './pages/QuienesSomos.jsx'
import { Contacto } from './pages/Contacto.jsx'
import { Productos } from './pages/Productos.jsx'
import { Servicios } from './pages/Servicios.jsx'
import { Login } from './pages/Login.jsx'
import { AdminPanel } from './pages/AdminPanel.jsx'
import { EmpleadoPanel } from './pages/EmpleadoPanel.jsx'
import { ClientePanel } from './pages/ClientePanel.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute rolesPermitidos={['Administrador']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/empleado"
                    element={
                        <ProtectedRoute rolesPermitidos={['Administrador', 'Empleado']}>
                            <EmpleadoPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cliente"
                    element={
                        <ProtectedRoute rolesPermitidos={['Administrador', 'Empleado', 'Cliente']}>
                            <ClientePanel />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default App