import pool from "../config/db.js";

export const listarProductos = async () => {
    const [rows] = await pool.execute("SELECT * FROM productos ORDER BY id_producto DESC");
    return rows;
};

export const buscarProductoPorId = async (id_producto) => {
    const [rows] = await pool.execute(
        "SELECT * FROM productos WHERE id_producto = ? LIMIT 1", [id_producto]

    );
    return rows[0];
};

export const listarProductosActivos = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM productos WHERE estado = 'activo' ORDER BY id_producto DESC"
    );
    return rows
}

export const crearProducto = async (producto) => {
    const { nombre, descripcion, precio, stock } = producto;
    const [result] = await pool.execute(
        "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, precio, stock]
    );
    return result.insertId;
};

export const actualizarProducto = async (id_producto, producto) => {
    const { nombre, descripcion, precio, stock} = producto;
    await pool.execute(
        "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?",
        [nombre, descripcion, precio, stock, id_producto]
    );
};

export const cambiarEstadoProducto = async (id_producto, estado) => {
    await pool.execute(
        "UPDATE productos SET estado = ? WHERE id_producto = ?",
        [estado, id_producto]
    );
};

export const eliminarProducto = async (id_producto) => {
    await pool.execute("DELETE FROM productos WHERE id_producto = ?", [id_producto]);
};