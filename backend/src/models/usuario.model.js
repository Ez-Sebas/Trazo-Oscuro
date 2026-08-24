import pool from "../config/db.js";

export const buscarUsuarioPorEmail = async (email) => {
    const [rows] = await pool.execute(
        "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
        [email]
    );
    return rows[0];
};

export const buscarUsuarioPorDocumento = async (numero_documento) => {
    const [rows] = await pool.execute(
        "SELECT * FROM usuarios WHERE numero_documento = ? LIMIT 1",
        [numero_documento]
    );
    return rows[0];
};

export const buscarUsuarioPorId = async (id_usuario) => {
    const [rows] = await pool.execute(
        `SELECT u.id_usuario, u.nombres, u.apellidos, u.tipo_documento, u.numero_documento,
                u.direccion, u.telefono, u.email, u.estado, u.id_rol, r.nombre AS rol,
                u.fecha_registro
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?`,
        [id_usuario]
    );
    return rows[0];
};

export const crearUsuario = async (usuario) => {
    const {
        nombres, apellidos, tipo_documento, numero_documento,
        direccion, telefono, email, password, id_rol,
    } = usuario;

    const [result] = await pool.execute(
        `INSERT INTO usuarios
        (nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, password, id_rol)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, password, id_rol]
    );
    return result.insertId;
};

export const actualizarUltimoAcceso = async (id_usuario) => {
    await pool.execute(
        "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?",
        [id_usuario]
    );
};

export const listarUsuarios = async () => {
    const [rows] = await pool.execute(
        `SELECT u.id_usuario, u.nombres, u.apellidos, u.tipo_documento, u.numero_documento,
                u.direccion, u.telefono, u.email, u.estado, u.id_rol, r.nombre AS rol,
                u.fecha_registro
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        ORDER BY u.id_usuario DESC`
    );
    return rows;
};

export const actualizarUsuario = async (id_usuario, datos) => {
    const { nombres, apellidos, direccion, telefono, tipo_documento, numero_documento } = datos;
    await pool.execute(
        `UPDATE usuarios
        SET nombres = ?, apellidos = ?, direccion = ?, telefono = ?, tipo_documento = ?, numero_documento = ?
        WHERE id_usuario = ?`,
        [nombres, apellidos, direccion, telefono, tipo_documento, numero_documento, id_usuario]
    );
};

export const cambiarEstadoUsuario = async (id_usuario, estado) => {
    await pool.execute(
        "UPDATE usuarios SET estado = ? WHERE id_usuario = ?",
        [estado, id_usuario]
    );
};

export const eliminarUsuario = async (id_usuario) => {
    await pool.execute("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);
};