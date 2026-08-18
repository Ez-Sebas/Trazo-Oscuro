import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [estadoAuth, setEstadoAuth] = useState({ usuario: null, cargando: true })

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('trazo_sesion')
        setEstadoAuth({
            usuario: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
            cargando: false,
        })
    }, [])

    const iniciarSesion = (usuario) => {
        const datosSesion = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
        }
        setEstadoAuth((prev) => ({ ...prev, usuario: datosSesion }))
        localStorage.setItem('trazo_sesion', JSON.stringify(datosSesion))
    }

    const cerrarSesion = () => {
        setEstadoAuth((prev) => ({ ...prev, usuario: null }))
        localStorage.removeItem('trazo_sesion')
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: estadoAuth.usuario,
                cargando: estadoAuth.cargando,
                iniciarSesion,
                cerrarSesion,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)