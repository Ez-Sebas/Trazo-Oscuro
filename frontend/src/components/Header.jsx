import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export const Header = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuAbierto, setMenuAbierto] = useState(false)
    const { usuario, cerrarSesion } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const manejarScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', manejarScroll)
        return () => window.removeEventListener('scroll', manejarScroll)
    }, [])

    const manejarCerrarSesion = () => {
        cerrarSesion()
        setMenuAbierto(false)
        navigate('/')
    }

    const rutaPanel = () => {
        if (!usuario) return '/'
        if (usuario.rol === 'Administrador') return '/admin'
        if (usuario.rol === 'Empleado') return '/empleado'
        return '/cliente'
    }

    const enlaces = [
        { to: '/', texto: 'Inicio' },
        { to: '/productos', texto: 'Productos' },
        { to: '/servicios', texto: 'Servicios' },
        { to: '/quienes-somos', texto: '¿Quiénes Somos?' },
        { to: '/contacto', texto: 'Contacto' },
    ]

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-fondo/80 backdrop-blur-sm' : 'bg-fondo'}`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                <Link to="/" onClick={() => setMenuAbierto(false)}>
                    <div className="flex items-center">
                        <svg className="w-36 h-auto sm:w-44 md:w-52 lg:w-220px" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg" aria-label="Trazo Oscuro">
                            <g transform="translate(22, -4)">
                                <path d="M 8 12 H 55" stroke="#1A1A1A" strokeWidth="10" strokeLinecap="round"/>
                                <path d="M 8 12 H 55 M 31 12 V 38 L 20 50" fill="none" className="stroke-texto" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="20" cy="50" r="4" className="fill-acento"/>
                            </g>
                            <text x="62" y="29" className="fill-texto" fontFamily="Georgia, serif" fontSize="20" fontWeight="600" letterSpacing="2">
                                RAZO
                            </text>
                            <text x="62" y="49" className="fill-texto-secundario" fontFamily="Georgia, serif" fontSize="15" letterSpacing="3">
                                OSCURO
                            </text>
                        </svg>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                    {enlaces.map((enlace) => (
                        <Link key={enlace.to} to={enlace.to} className="text-texto text-sm lg:text-base px-2 py-2 rounded-lg whitespace-nowrap hover:bg-fondo hover:shadow-[0_4px_8px] hover:text-acento transition-all duration-300">
                            {enlace.texto}
                        </Link>
                    ))}
                </nav>

                {usuario ? (
                    <div className="hidden md:flex items-center gap-3">
                        <Link to={rutaPanel()} className="text-texto-secundario text-sm hover:text-acento transition-colors">
                            Hola, {usuario.nombres}
                        </Link>
                        <button onClick={manejarCerrarSesion} className="text-acento text-sm px-3 py-2 rounded-lg border border-acento hover:bg-acento hover:text-texto transition-all duration-300 cursor-pointer">
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="hidden md:block text-texto text-sm lg:text-base px-2 py-2 rounded-lg whitespace-nowrap hover:bg-fondo hover:shadow-[0_4px_8px] hover:text-acento transition-all duration-300">
                        Iniciar sesión
                    </Link>
                )}

                <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden text-texto w-9 h-9 flex items-center justify-center cursor-pointer" aria-label="Abrir menú">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        {menuAbierto ? (
                            <path d="M 5 5 L 19 19 M 19 5 L 5 19" stroke="#F5F5F4" strokeWidth="2" strokeLinecap="round" />
                        ) : (
                            <path d="M 4 6 L 20 6 M 4 12 L 20 12 M 4 18 L 20 18" stroke="#F5F5F4" strokeWidth="2" strokeLinecap="round" />
                        )}
                    </svg>
                </button>
            </div>

            <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuAbierto ? 'max-h-96' : 'max-h-0'}`}>
                <nav className="flex flex-col px-6 pb-4 gap-1 bg-fondo border-t border-borde">
                    {enlaces.map((enlace) => (
                        <Link key={enlace.to} to={enlace.to} onClick={() => setMenuAbierto(false)} className="text-texto text-sm px-2 py-3 rounded-lg hover:text-acento transition-colors">
                            {enlace.texto}
                        </Link>
                    ))}
                    {usuario ? (
                        <>
                            <Link to={rutaPanel()} onClick={() => setMenuAbierto(false)} className="text-texto text-sm px-2 py-3 rounded-lg hover:text-acento transition-colors">
                                Hola, {usuario.nombres}
                            </Link>
                            <button onClick={manejarCerrarSesion} className="text-acento text-sm px-2 py-3 rounded-lg font-medium text-left cursor-pointer">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMenuAbierto(false)} className="text-acento text-sm px-2 py-3 rounded-lg font-medium">
                            Iniciar sesión
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}