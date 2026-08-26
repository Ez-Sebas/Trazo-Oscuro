import express from "express";
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    editarUsuario,
    cambiarEstado,
    borrarUsuario,
    crearUsuarioAdmin,
    cambiarRol,
    obtenerMiPerfil,
    actualizarMiPerfil,
} from "../controllers/usuario.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas de perfil propio (cualquier usuario autenticado) — van ANTES de "/:id"
router.get("/perfil/me", verificarToken, obtenerMiPerfil);
router.put("/perfil/me", verificarToken, actualizarMiPerfil);

// Rutas de administración (solo Administrador)
router.get("/", verificarToken, verificarRol("Administrador"), obtenerUsuarios);
router.post("/", verificarToken, verificarRol("Administrador"), crearUsuarioAdmin);
router.get("/:id", verificarToken, verificarRol("Administrador"), obtenerUsuarioPorId);
router.put("/:id", verificarToken, verificarRol("Administrador"), editarUsuario);
router.patch("/:id/estado", verificarToken, verificarRol("Administrador"), cambiarEstado);
router.patch("/:id/rol", verificarToken, verificarRol("Administrador"), cambiarRol);
router.delete("/:id", verificarToken, verificarRol("Administrador"), borrarUsuario);

export default router;