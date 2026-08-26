import pool from "../config/db.js";

export const listarServicios = async () => {
    const [rows] = await pool.execute("SELECT * FROM servicios ORDER BY id_servicio DESC");
    return rows;
};

export const buscarServicioPorId = async (id_servicio) => {
    const [rows] = await pool.execute(
        "SELECT * FROM servicios WHERE id_servicio = ? LIMIT 1",
        [id_servicio]
    );
    return rows[0];
};

export const listarServiciosActivos = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM servicios WHERE estado = 'activo' ORDER BY id_servicio DESC"
    );
    return rows;
};

export const crearServicio = async (servicio) => {
    const { nombre, descripcion, precio, duracion_estimada } = servicio;
    const [result] = await pool.execute(
        "INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, precio, duracion_estimada]
    );
    return result.insertId;
};

export const actualizarServicio = async (id_servicio, servicio) => {
    const { nombre, descripcion, precio, duracion_estimada } = servicio;
    await pool.execute(
        "UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, duracion_estimada = ? WHERE id_servicio = ?",
        [nombre, descripcion, precio, duracion_estimada, id_servicio]
    );
};

export const cambiarEstadoServicio = async (id_servicio, estado) => {
    await pool.execute(
        "UPDATE servicios SET estado = ? WHERE id_servicio = ?",
        [estado, id_servicio]
    );
};

export const eliminarServicio = async (id_servicio) => {
    await pool.execute("DELETE FROM servicios WHERE id_servicio = ?", [id_servicio]);
};