import express from "express";
import { obtenerUsuarios, obtenerUsuarioPorId, editarUsuario, cambiarEstado, borrarUsuario } from "../controllers/usuario.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verificarToken, verificarRol("Administrador"), obtenerUsuarios);
router.get("/:id", verificarToken, verificarRol("Administrador"), obtenerUsuarioPorId);
router.put("/:id", verificarToken, verificarRol("Administrador"), editarUsuario);
router.patch("/:id/estado", verificarToken, verificarRol("Administrador"), cambiarEstado);
router.delete("/:id", verificarToken, verificarRol("Administrador"), borrarUsuario);

export default router;