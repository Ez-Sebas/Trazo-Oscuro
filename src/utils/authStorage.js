const CLAVE_USUARIOS = 'trazo_usuarios'

export const obtenerUsuarios = () => {
    const datos = localStorage.getItem(CLAVE_USUARIOS)
    return datos ? JSON.parse(datos) : []
}

export const existeCorreo = (correo) => {
    const usuarios = obtenerUsuarios()
    return usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase())
}

export const registrarUsuario = (usuario) => {
    const usuarios = obtenerUsuarios()
    usuarios.push(usuario)
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

export const validarCredenciales = (correo, contrasena) => {
    const usuarios = obtenerUsuarios()
    const encontrado = usuarios.find(
        (u) => u.correo.toLowerCase() === correo.toLowerCase()
    )

    if (!encontrado) {
        return { ok: false, motivo: 'correo' }
    }

    if (encontrado.contrasena !== contrasena) {
        return { ok: false, motivo: 'contrasena' }
    }

    return { ok: true, usuario: encontrado }
}