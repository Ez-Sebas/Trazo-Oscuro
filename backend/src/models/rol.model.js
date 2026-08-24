import pool from "../config/db.js";

export const listarRoles = async () => {
    const [rows] = await pool.execute("SELECT * FROM roles ORDER BY id_rol");
    return rows;
};

export const buscarRolPorNombre = async (nombre) => {
    const [rows] = await pool.execute(
        "SELECT * FROM roles WHERE nombre = ? LIMIT 1",
        [nombre]
    );
    return rows[0];
};

export const buscarRolPorId = async (id_rol) => {
    const [rows] = await pool.execute(
        "SELECT * FROM roles WHERE id_rol = ? LIMIT 1",
        [id_rol]
    );
    return rows[0];
};