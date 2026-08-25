import {
    listarProductos,
    buscarProductoPorId,
    crearProducto,
    actualizarProducto,
    cambiarEstadoProducto,
    eliminarProducto,
} from "../models/producto.model.js";

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await listarProductos();
        return res.status(200).json({ success: true, productos });
    } catch (error) {
        console.error("Error al listar productos:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const registrarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;

        if (!nombre || precio === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Nombre, precio y stock son obligatorios.",
            });
        }

        if (precio <= 0 || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "El precio debe ser mayor a 0 y el stock no puede ser negativo.",
            });
        }

        const id = await crearProducto({ nombre, descripcion, precio, stock });
        return res.status(201).json({
            success: true,
            message: "Producto creado correctamente.",
            id_producto: id,
        });
    } catch (error) {
        console.error("Error al crear producto:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const editarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock } = req.body;

        const existe = await buscarProductoPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Producto no encontrado." });
        }

        if (!nombre || precio === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Nombre, precio y stock son obligatorios.",
            });
        }

        await actualizarProducto(id, { nombre, descripcion, precio, stock });
        return res.status(200).json({ success: true, message: "Producto actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const cambiarEstadoProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!["activo", "inactivo"].includes(estado)) {
            return res.status(400).json({ success: false, message: "El estado debe ser 'activo' o 'inactivo'." });
        }

        const existe = await buscarProductoPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Producto no encontrado." });
        }

        await cambiarEstadoProducto(id, estado);
        return res.status(200).json({ success: true, message: `Producto marcado como ${estado}.` });
    } catch (error) {
        console.error("Error al cambiar estado del producto:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const borrarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const existe = await buscarProductoPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Producto no encontrado." });
        }

        await eliminarProducto(id);
        return res.status(200).json({ success: true, message: "Producto eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};