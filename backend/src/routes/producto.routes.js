import express from "express";
import {
    obtenerProductos,
    registrarProducto,
    editarProducto,
    cambiarEstadoProductoController,
    borrarProducto,
} from "../controllers/producto.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerProductos);
router.post("/", verificarToken, verificarRol("Administrador"), registrarProducto);
router.put("/:id", verificarToken, verificarRol("Administrador"), editarProducto);
router.patch("/:id/estado", verificarToken, verificarRol("Administrador"), cambiarEstadoProductoController);
router.delete("/:id", verificarToken, verificarRol("Administrador"), borrarProducto);

export default router;