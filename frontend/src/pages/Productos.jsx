import { useState, useEffect } from 'react'
import { obtenerProductosActivos } from '../services/productoService.js'

export const Productos = () => {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        obtenerProductosActivos()
            .then((data) => setProductos(data.productos))
            .finally(() => setCargando(false))
    }, [])

    return (
        <div className="bg-fondo min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-texto font-serif text-4xl mb-3">Productos</h1>
                    <p className="text-texto-secundario">Cuidado profesional para tu tatuaje y mercancía del estudio</p>
                </div>

                {cargando && <p className="text-texto-secundario text-center">Cargando productos...</p>}

                {!cargando && productos.length === 0 && (
                    <p className="text-texto-secundario text-center">No hay productos disponibles por el momento.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {productos.map((p) => (
                        <div key={p.id_producto} className="bg-superficie rounded-lg p-5">
                            <h3 className="text-texto font-serif text-lg mb-2">{p.nombre}</h3>
                            <p className="text-texto-secundario text-sm mb-3">{p.descripcion}</p>
                            <p className="text-acento font-medium">${Number(p.precio).toLocaleString('es-CO')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}