import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import servicioRoutes from "./routes/servicio.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Trazo Oscuro funcionando correctamente.",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/usuarios", usuarioRoutes);
app.use("/api/v1/productos", productoRoutes);
app.use("/api/v1/servicios", servicioRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada.",
    });
});

export default app;