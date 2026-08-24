CREATE DATABASE IF NOT EXISTS bd_trazo_oscuro
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bd_trazo_oscuro;

-- ============================
-- TABLA: roles
-- ============================
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Control total del sistema: usuarios, productos y servicios'),
('Empleado', 'Gestiona servicios y atención a clientes'),
('Cliente', 'Usuario final que agenda servicios y compra productos');

-- ============================
-- TABLA: permisos
-- ============================
CREATE TABLE permisos (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

INSERT INTO permisos (nombre, descripcion) VALUES
('gestionar_usuarios', 'Crear, editar, cambiar estado y eliminar usuarios'),
('gestionar_productos', 'Crear, editar y eliminar productos'),
('gestionar_servicios', 'Crear, editar y eliminar servicios'),
('ver_reportes', 'Consultar reportes generales del sistema'),
('gestionar_citas', 'Administrar citas/agendamientos de servicios'),
('ver_perfil_propio', 'Ver y editar la información de su propio perfil');

-- ============================
-- TABLA: rol_permisos (relación muchos a muchos)
-- ============================
CREATE TABLE rol_permisos (
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE
);

-- Administrador: todos los permisos
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 1, id_permiso FROM permisos;

-- Empleado: gestionar servicios, citas y ver su propio perfil
INSERT INTO rol_permisos (id_rol, id_permiso) VALUES
(2, 3), (2, 5), (2, 6);

-- Cliente: solo ver su propio perfil
INSERT INTO rol_permisos (id_rol, id_permiso) VALUES
(3, 6);

-- ============================
-- TABLA: usuarios
-- ============================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL DEFAULT 3,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    tipo_documento VARCHAR(5) NOT NULL,
    numero_documento VARCHAR(15) NOT NULL UNIQUE,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    foto VARCHAR(255) DEFAULT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    ultimo_acceso DATETIME DEFAULT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- ============================
-- TABLA: servicios
-- ============================
CREATE TABLE servicios (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    duracion_estimada VARCHAR(30),
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada) VALUES
('Tatuaje Realismo', 'Retratos y figuras con sombreado detallado, casi fotográfico.', 250000, '3-5 horas'),
('Tatuaje Blackwork', 'Diseños sólidos en negro, geometría y contraste fuerte.', 180000, '2-4 horas'),
('Tatuaje Fine Line', 'Líneas delgadas y delicadas, ideal para diseños minimalistas.', 120000, '1-2 horas'),
('Tatuaje Japonés', 'Tradición irezumi: dragones, olas y flores con gran detalle.', 350000, '5-8 horas'),
('Retoque', 'Sesión de retoque para tatuajes ya realizados en el estudio.', 60000, '30-60 min');

-- ============================
-- TABLA: productos
-- ============================
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Crema cicatrizante', 'Crema especializada para el cuidado de tatuajes recién hechos.', 35000, 50),
('Espuma limpiadora', 'Espuma neutra para la limpieza diaria del tatuaje en cicatrización.', 28000, 40),
('Protector solar tatuajes', 'Protección UV especial para mantener el color del tatuaje.', 42000, 30),
('Camiseta Trazo Oscuro', 'Camiseta oficial de la marca, algodón 100%.', 55000, 25);