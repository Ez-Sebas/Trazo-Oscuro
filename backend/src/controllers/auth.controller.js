import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    buscarUsuarioPorEmail,
    buscarUsuarioPorDocumento,
    crearUsuario,
    actualizarUltimoAcceso,
} from "../models/usuario.model.js";
import { buscarRolPorId } from "../models/rol.model.js";

export const register = async (req, res) => {
    try {
        const {
            nombres, apellidos, tipo_documento, numero_documento,
            direccion, telefono, email, password,
        } = req.body;

        if (
            !nombres || !apellidos || !tipo_documento || !numero_documento ||
            !direccion || !telefono || !email || !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos obligatorios deben ser diligenciados.",
            });
        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(email)) {
            return res.status(400).json({
                success: false,
                message: "El formato del correo electrónico no es válido.",
            });
        }

        const regexNumeros = /^[0-9]+$/;
        if (!regexNumeros.test(numero_documento) || numero_documento.length < 6 || numero_documento.length > 15) {
            return res.status(400).json({
                success: false,
                message: "El número de documento debe tener entre 6 y 15 dígitos numéricos.",
            });
        }

        if (!/^[0-9]{7,10}$/.test(telefono)) {
            return res.status(400).json({
                success: false,
                message: "El teléfono debe tener entre 7 y 10 dígitos numéricos.",
            });
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener entre 8 y 20 caracteres.",
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const usuarioExiste = await buscarUsuarioPorEmail(emailNormalizado);
        if (usuarioExiste) {
            return res.status(409).json({
                success: false,
                message: "El correo electrónico ya está registrado.",
            });
        }

        const documentoExiste = await buscarUsuarioPorDocumento(numero_documento);
        if (documentoExiste) {
            return res.status(409).json({
                success: false,
                message: "El número de documento ya está registrado.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const ID_ROL_CLIENTE = 3;

        const usuarioId = await crearUsuario({
            nombres,
            apellidos,
            tipo_documento,
            numero_documento,
            direccion,
            telefono,
            email: emailNormalizado,
            password: passwordHash,
            id_rol: ID_ROL_CLIENTE,
        });

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente.",
            usuario: {
                id: usuarioId,
                nombres,
                apellidos,
                email: emailNormalizado,
            },
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "El correo y la contraseña son obligatorios.",
            });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const usuario = await buscarUsuarioPorEmail(emailNormalizado)

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "No existe una cuenta con este correo.",
            });
        }

        if (usuario.estado === "inactivo") {
            return res.status(403).json({
                success: false,
                message: "Esta cuenta se encuentra inactiva. Contacta al estudio.",
            });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) {
            return res.status(401).json({
                success: false,
                message: "Contraseña incorrecta.",
            });
        }

        const rol = await buscarRolPorId(usuario.id_rol);

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                rol: rol.nombre,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        await actualizarUltimoAcceso(usuario.id_usuario);

        return res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso.",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: rol.nombre,
            },
        });
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
        });
    }
};