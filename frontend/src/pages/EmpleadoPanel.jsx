import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { ProductosCRUD } from '../components/admin/ProductosCRUD.jsx'
import { ServiciosCRUD } from '../components/admin/ServiciosCRUD.jsx'

const tabs = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'productos', label: 'Productos' },
]

export const EmpleadoPanel = () => {
    const [tab, setTab] = useState('servicios')
    const { usuario } = useAuth()

    return (
        <div className="bg-fondo min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-texto font-serif text-3xl mb-2">Panel de Empleado</h1>
                <p className="text-texto-secundario text-sm mb-6">Bienvenido, {usuario?.nombres}. Gestiona servicios y productos.</p>

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

                {tab === 'servicios' && <ServiciosCRUD />}
                {tab === 'productos' && <ProductosCRUD />}
            </div>
        </div>
    )
}