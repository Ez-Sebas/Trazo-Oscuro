import express from "express";
import {
    obtenerServicios,
    registrarServicio,
    editarServicio,
    cambiarEstadoServicioController,
    borrarServicio,
} from "../controllers/servicio.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerServicios);
router.post("/", verificarToken, verificarRol("Administrador", "Empleado"), registrarServicio);
router.put("/:id", verificarToken, verificarRol("Administrador", "Empleado"), editarServicio);
router.patch("/:id/estado", verificarToken, verificarRol("Administrador", "Empleado"), cambiarEstadoServicioController);
router.delete("/:id", verificarToken, verificarRol("Administrador"), borrarServicio);

export default router;