import {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    buscarUsuarioPorDocumento,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
} from "../models/usuario.model.js";

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        return res.status(200).json({
            success: true,
            usuarios,
        });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};

export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await buscarUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({ 
            success: true, 
            usuario,
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};

export const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, direccion, telefono, tipo_documento, numero_documento } = req.body;

        if (!nombres || !apellidos || !direccion || !telefono || !tipo_documento || !numero_documento) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos obligatorios deben ser diligenciados.",
            });
        }

        if (!/^[0-9]{7,10}$/.test(telefono)) {
            return res.status(400).json({
                success: false,
                message: "El teléfono debe tener entre 7 y 10 dígitos numéricos.",
            });
        }

        const regexNumeros = /^[0-9]+$/;
        if (!regexNumeros.test(numero_documento) || numero_documento.length < 6 || numero_documento.length > 15) {
            return res.status(400).json({
                success: false,
                message: "El número de documento debe tener entre 6 y 15 dígitos numéricos.",
            });
        }

        const usuarioExiste = await buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado.",
            });
        }

        await actualizarUsuario(id, { nombres, apellidos, direccion, telefono, tipo_documento, numero_documento });

        return res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente.",
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};

export const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!["activo", "inactivo"].includes(estado)) {
            return res.status(400).json({
                success: false,
                message: "El estado debe ser 'activo' o 'inactivo'.",
            });
        }

        const usuarioExiste = await buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado.",
            });
        }

        await cambiarEstadoUsuario(id, estado);

        return res.status(200).json({
            success: true,
            message: `Usuario marcado como ${estado} correctamente.`,
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};

export const borrarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioExiste = await buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado.",
            });
        }

        await eliminarUsuario(id);

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente.",
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};