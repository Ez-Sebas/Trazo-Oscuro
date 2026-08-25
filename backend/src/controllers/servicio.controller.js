import {
    listarServicios,
    buscarServicioPorId,
    crearServicio,
    actualizarServicio,
    cambiarEstadoServicio,
    eliminarServicio,
} from "../models/servicio.model.js";

export const obtenerServicios = async (req, res) => {
    try {
        const servicios = await listarServicios();
        return res.status(200).json({ success: true, servicios });
    } catch (error) {
        console.error("Error al listar servicios:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const registrarServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio, duracion_estimada } = req.body;

        if (!nombre || precio === undefined) {
            return res.status(400).json({
                success: false,
                message: "Nombre y precio son obligatorios.",
            });
        }

        if (precio <= 0) {
            return res.status(400).json({ success: false, message: "El precio debe ser mayor a 0." });
        }

        const id = await crearServicio({ nombre, descripcion, precio, duracion_estimada });
        return res.status(201).json({
            success: true,
            message: "Servicio creado correctamente.",
            id_servicio: id,
        });
    } catch (error) {
        console.error("Error al crear servicio:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const editarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, duracion_estimada } = req.body;

        const existe = await buscarServicioPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Servicio no encontrado." });
        }

        if (!nombre || precio === undefined) {
            return res.status(400).json({ success: false, message: "Nombre y precio son obligatorios." });
        }

        await actualizarServicio(id, { nombre, descripcion, precio, duracion_estimada });
        return res.status(200).json({ success: true, message: "Servicio actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar servicio:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const cambiarEstadoServicioController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!["activo", "inactivo"].includes(estado)) {
            return res.status(400).json({ success: false, message: "El estado debe ser 'activo' o 'inactivo'." });
        }

        const existe = await buscarServicioPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Servicio no encontrado." });
        }

        await cambiarEstadoServicio(id, estado);
        return res.status(200).json({ success: true, message: `Servicio marcado como ${estado}.` });
    } catch (error) {
        console.error("Error al cambiar estado del servicio:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const borrarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const existe = await buscarServicioPorId(id);
        if (!existe) {
            return res.status(404).json({ success: false, message: "Servicio no encontrado." });
        }

        await eliminarServicio(id);
        return res.status(200).json({ success: true, message: "Servicio eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar servicio:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};