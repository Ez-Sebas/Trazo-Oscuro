import {
    listarUsuarios,
    buscarUsuarioPorId,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
    crearUsuario,
    buscarUsuarioPorEmail,
    buscarUsuarioPorDocumento,
    buscarUsuarioPorEmailExcluyendo,
    buscarUsuarioPorDocumentoExcluyendo,
    actualizarPerfilUsuario,
    cambiarRolUsuario,
} from "../models/usuario.model.js";
import bcrypt from "bcrypt";

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

export const crearUsuarioAdmin = async (req, res) => {
    try {
        const {
            nombres, apellidos, tipo_documento, numero_documento,
            direccion, telefono, email, password, id_rol,
        } = req.body;

        if (!nombres || !apellidos || !tipo_documento || !numero_documento || !direccion || !telefono || !email || !password || !id_rol) {
            return res.status(400).json({ success: false, message: "Todos los campos son obligatorios, incluido el rol." });
        }

        if (![1, 2, 3].includes(Number(id_rol))) {
            return res.status(400).json({ success: false, message: "Rol inválido." });
        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(email)) {
            return res.status(400).json({ success: false, message: "El correo no es válido." });
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({ success: false, message: "La contraseña debe tener entre 8 y 20 caracteres." });
        }

        const emailNormalizado = email.trim().toLowerCase();

        if (await buscarUsuarioPorEmail(emailNormalizado)) {
            return res.status(409).json({ success: false, message: "El correo ya está registrado." });
        }
        if (await buscarUsuarioPorDocumento(numero_documento)) {
            return res.status(409).json({ success: false, message: "El documento ya está registrado." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const id = await crearUsuario({
            nombres, apellidos, tipo_documento, numero_documento, direccion, telefono,
            email: emailNormalizado, password: passwordHash, id_rol: Number(id_rol),
        });

        return res.status(201).json({ success: true, message: "Usuario creado correctamente.", id_usuario: id });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_rol } = req.body;

        if (![1, 2, 3].includes(Number(id_rol))) {
            return res.status(400).json({ success: false, message: "Rol inválido." });
        }

        const existe = await buscarUsuarioPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }

        await cambiarRolUsuario(id, Number(id_rol));
        return res.status(200).json({ success: true, message: "Rol actualizado correctamente." });
    } catch (error) {
        console.error("Error al cambiar rol:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const obtenerMiPerfil = async (req, res) => {
    try {
        const usuario = await buscarUsuarioPorId(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }
        return res.status(200).json({ success: true, usuario });
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const actualizarMiPerfil = async (req, res) => {
    try {
        const id = req.usuario.id;
        const { nombres, apellidos, direccion, telefono, tipo_documento, numero_documento, email } = req.body;

        if (!nombres || !apellidos || !direccion || !telefono || !tipo_documento || !numero_documento || !email) {
            return res.status(400).json({ success: false, message: "Todos los campos obligatorios deben ser diligenciados." });
        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(email)) {
            return res.status(400).json({ success: false, message: "El correo no es válido." });
        }

        if (!/^[0-9]{7,10}$/.test(telefono)) {
            return res.status(400).json({ success: false, message: "El teléfono debe tener entre 7 y 10 dígitos numéricos." });
        }

        const regexNumeros = /^[0-9]+$/;
        if (!regexNumeros.test(numero_documento) || numero_documento.length < 6 || numero_documento.length > 15) {
            return res.status(400).json({ success: false, message: "El documento debe tener entre 6 y 15 dígitos numéricos." });
        }

        const emailNormalizado = email.trim().toLowerCase();

        if (await buscarUsuarioPorEmailExcluyendo(emailNormalizado, id)) {
            return res.status(409).json({ success: false, message: "Ese correo ya está en uso por otra cuenta." });
        }
        if (await buscarUsuarioPorDocumentoExcluyendo(numero_documento, id)) {
            return res.status(409).json({ success: false, message: "Ese documento ya está en uso por otra cuenta." });
        }

        await actualizarPerfilUsuario(id, {
            nombres, apellidos, direccion, telefono, tipo_documento, numero_documento, email: emailNormalizado,
        });

        return res.status(200).json({ success: true, message: "Perfil actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};