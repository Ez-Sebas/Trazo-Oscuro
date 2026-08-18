import { useState } from 'react'

export const Contacto = () => {
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [mensaje, setMensaje] = useState('')

    const enviarFormulario = (e) => {
        e.preventDefault()
        alert(`Gracias ${nombre}, tu mensaje fue enviado.`)
        setNombre('')
        setCorreo('')
        setMensaje('')
    }

    return (
        <div className="bg-fondo pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-texto font-serif text-4xl md:text-5xl mb-4">
                        Contacto
                    </h1>
                    <p className="text-texto-secundario text-lg">
                        ¿Tienes una idea en mente? Cuéntanosla.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-texto font-serif text-xl mb-6">
                        Información del Estudio
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-texto-secundario text-xs uppercase tracking-wide mb-1">Dirección</p>
                                <p className="text-texto text-sm">Cra 45 #26-85, Medellín, Colombia</p>
                            </div>
                            <div>
                                <p className="text-texto-secundario text-xs uppercase tracking-wide mb-1">Teléfono</p>
                                <p className="text-texto text-sm">+57 300 123 4567</p>
                            </div>
                            <div>
                                <p className="text-texto-secundario text-xs uppercase tracking-wide mb-1">Correo</p>
                                <p className="text-texto text-sm">contacto@trazooscuro.com</p>
                            </div>
                            <div>
                                <p className="text-texto-secundario text-xs uppercase tracking-wide mb-1">Horario</p>
                                <p className="text-texto text-sm">Martes a Sábado, 11:00 a.m. – 7:00 p.m.</p>
                            </div>
                            <div>
                                <p className="text-texto-secundario text-xs uppercase tracking-wide mb-1">Síguenos</p>
                                <p className="text-texto text-sm">@trazooscuro.tattoo</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={enviarFormulario} className="bg-superficie rounded-lg p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="nombre" className="text-texto-secundario text-sm">
                                Nombre completo
                            </label>
                            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="bg-fondo border border-borde rounded-md px-3 py-2 text-texto text-sm focus:outline-none focus:border-acento transition-colors"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="correo" className="text-texto-secundario text-sm">
                                Correo electrónico
                            </label>
                            <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required className="bg-fondo border border-borde rounded-md px-3 py-2 text-texto text-sm focus:outline-none focus:border-acento transition-colors"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="mensaje" className="text-texto-secundario text-sm">
                                Mensaje
                            </label>
                            <textarea id="mensaje" rows="4" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required className="bg-fondo border border-borde rounded-md px-3 py-2 text-texto text-sm resize-none focus:outline-none focus:border-acento transition-colors"/>
                        </div>
                        <button
                        type="submit"
                        className="bg-acento text-texto py-3 rounded-md hover:bg-red-800 transition-colors mt-2"
                        >
                        Enviar mensaje
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}