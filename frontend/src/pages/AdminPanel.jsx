import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { UsuariosCRUD } from '../components/admin/UsuariosCRUD.jsx'
import { ProductosCRUD } from '../components/admin/ProductosCRUD.jsx'
import { ServiciosCRUD } from '../components/admin/ServiciosCRUD.jsx'

const tabs = [
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'productos', label: 'Productos' },
    { id: 'servicios', label: 'Servicios' },
]

export const AdminPanel = () => {
    const [tab, setTab] = useState('usuarios')
    const { usuario } = useAuth()

    return (
        <div className="bg-fondo min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-texto font-serif text-3xl mb-2">Panel de Administrador</h1>
                <p className="text-texto-secundario text-sm mb-6">Bienvenido, {usuario?.nombres}. Gestiona todo el sistema.</p>

                <div className="flex gap-2 mb-8 border-b border-borde">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                                tab === t.id ? 'text-acento border-b-2 border-acento' : 'text-texto-secundario hover:text-texto'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'usuarios' && <UsuariosCRUD />}
                {tab === 'productos' && <ProductosCRUD />}
                {tab === 'servicios' && <ServiciosCRUD />}
            </div>
        </div>
    )
}