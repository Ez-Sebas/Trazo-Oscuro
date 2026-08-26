import express from "express";
import {
    obtenerProductos,
    obtenerProductosActivos,
    registrarProducto,
    editarProducto,
    cambiarEstadoProductoController,
    borrarProducto,
} from "../controllers/producto.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/activos", obtenerProductosActivos);
router.get("/", verificarToken, verificarRol("Administrador", "Empleado"), obtenerProductos);
router.post("/", verificarToken, verificarRol("Administrador", "Empleado"), registrarProducto);
router.put("/:id", verificarToken, verificarRol("Administrador", "Empleado"), editarProducto);
router.patch("/:id/estado", verificarToken, verificarRol("Administrador", "Empleado"), cambiarEstadoProductoController);
router.delete("/:id", verificarToken, verificarRol("Administrador", "Empleado"), borrarProducto);

export default router;