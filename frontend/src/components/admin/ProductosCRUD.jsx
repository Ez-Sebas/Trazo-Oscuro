import { useState, useEffect } from 'react'
import { obtenerProductos, crearProducto, editarProducto, cambiarEstadoProducto, eliminarProducto } from '../../services/productoService.js'
import { Input } from '../ui/Input.jsx'
import { Button } from '../ui/Button.jsx'

const valoresIniciales = {
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
}

export const ProductosCRUD = () => {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [nuevo, setNuevo] = useState(valoresIniciales)
    const [errores, setErrores] = useState({})
    const [editando, setEditando] = useState(null)
    const [formEdicion, setFormEdicion] = useState({})
    const [erroresEdicion, setErroresEdicion] = useState({})

    const cargar = async () => {
        setCargando(true)

        try {
            const data = await obtenerProductos()
            setProductos(data.productos)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargar()
    }, [])

    const validarCampo = (nombre, valor) => {
        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/
        const regexEntero = /^[0-9]+$/

        switch (nombre) {
            case 'nombre':
                if (!valor.trim()) return 'El nombre es obligatorio.'
                if (valor.trim().length < 2 || valor.trim().length > 60) {
                    return 'Debe tener entre 2 y 60 caracteres.'
                }
                if (!regexNombre.test(valor)) {
                    return 'Solo se permiten letras, números y espacios.'
                }
                return ''

            case 'descripcion':
                if (!valor.trim()) return 'La descripción es obligatoria.'
                if (valor.trim().length < 5 || valor.trim().length > 255) {
                    return 'Debe tener entre 5 y 255 caracteres.'
                }
                return ''

            case 'precio':
                if (valor === '') return 'El precio es obligatorio.'
                if (Number(valor) <= 0) return 'El precio debe ser mayor a 0.'
                return ''

            case 'stock':
                if (valor === '') return 'El stock es obligatorio.'
                if (!regexEntero.test(valor)) {
                    return 'El stock debe ser un número entero.'
                }
                if (Number(valor) < 0) {
                    return 'El stock no puede ser negativo.'
                }
                return ''

            default:
                return ''
        }
    }

    const manejarCambioNuevo = (e) => {
        const { name, value } = e.target

        const nuevosDatos = {
            ...nuevo,
            [name]: value
        }

        setNuevo(nuevosDatos)

        setErrores({
            ...errores,
            [name]: validarCampo(name, value)
        })
    }

    const manejarCrear = async (e) => {
        e.preventDefault()

        const nuevosErrores = {}

        Object.keys(nuevo).forEach((campo) => {
            nuevosErrores[campo] = validarCampo(campo, nuevo[campo])
        })

        setErrores(nuevosErrores)

        const hayErrores = Object.values(nuevosErrores).some(
            (mensaje) => mensaje !== ''
        )

        if (hayErrores) return

        try {
            await crearProducto({
                ...nuevo,
                nombre: nuevo.nombre.trim(),
                descripcion: nuevo.descripcion.trim(),
                precio: Number(nuevo.precio),
                stock: Number(nuevo.stock)
            })

            setNuevo(valoresIniciales)
            setErrores({})
            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    const iniciarEdicion = (p) => {
        setEditando(p.id_producto)

        setFormEdicion({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            stock: p.stock
        })

        setErroresEdicion({})
    }

    const manejarCambioEdicion = (e) => {
        const { name, value } = e.target

        const nuevosDatos = {
            ...formEdicion,
            [name]: value
        }

        setFormEdicion(nuevosDatos)

        setErroresEdicion({
            ...erroresEdicion,
            [name]: validarCampo(name, value)
        })
    }

    const guardarEdicion = async (id) => {
        const nuevosErrores = {}

        Object.keys(formEdicion).forEach((campo) => {
            nuevosErrores[campo] = validarCampo(campo, formEdicion[campo])
        })

        setErroresEdicion(nuevosErrores)

        const hayErrores = Object.values(nuevosErrores).some(
            (mensaje) => mensaje !== ''
        )

        if (hayErrores) return

        try {
            await editarProducto(id, {
                ...formEdicion,
                nombre: formEdicion.nombre.trim(),
                descripcion: formEdicion.descripcion.trim(),
                precio: Number(formEdicion.precio),
                stock: Number(formEdicion.stock)
            })

            setEditando(null)
            setErroresEdicion({})
            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    const alternarEstado = async (p) => {
        try {
            await cambiarEstadoProducto(
                p.id_producto,
                p.estado === 'activo' ? 'inactivo' : 'activo'
            )

            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    const eliminar = async (id) => {
        if (!confirm('¿Eliminar este producto?')) return

        try {
            await eliminarProducto(id)
            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div>
            <form
                onSubmit={manejarCrear}
                className="bg-superficie rounded-lg p-6 flex flex-col gap-4 mb-8"
            >
                <h2 className="text-texto font-serif text-lg">
                    Agregar nuevo producto
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={nuevo.nombre}
                        onChange={manejarCambioNuevo}
                        error={errores.nombre}
                        maxLength={60}
                    />

                    <Input
                        label="Precio"
                        name="precio"
                        type="number"
                        value={nuevo.precio}
                        onChange={manejarCambioNuevo}
                        error={errores.precio}
                    />
                </div>

                <Input
                    label="Descripción"
                    name="descripcion"
                    value={nuevo.descripcion}
                    onChange={manejarCambioNuevo}
                    error={errores.descripcion}
                    maxLength={255}
                />

                <Input
                    label="Stock"
                    name="stock"
                    type="number"
                    value={nuevo.stock}
                    onChange={manejarCambioNuevo}
                    error={errores.stock}
                />

                <Button type="submit">
                    Crear producto
                </Button>
            </form>

            {cargando ? (
                <p className="text-texto-secundario">
                    Cargando productos...
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productos.map((p) => (
                        <div
                            key={p.id_producto}
                            className="bg-superficie rounded-lg p-4"
                        >
                            {editando === p.id_producto ? (
                                <div className="flex flex-col gap-2">

                                    <Input
                                        label="Nombre"
                                        name="nombre"
                                        value={formEdicion.nombre}
                                        onChange={manejarCambioEdicion}
                                        error={erroresEdicion.nombre}
                                        maxLength={60}
                                    />

                                    <Input
                                        label="Descripción"
                                        name="descripcion"
                                        value={formEdicion.descripcion}
                                        onChange={manejarCambioEdicion}
                                        error={erroresEdicion.descripcion}
                                        maxLength={255}
                                    />

                                    <Input
                                        label="Precio"
                                        name="precio"
                                        type="number"
                                        value={formEdicion.precio}
                                        onChange={manejarCambioEdicion}
                                        error={erroresEdicion.precio}
                                    />

                                    <Input
                                        label="Stock"
                                        name="stock"
                                        type="number"
                                        value={formEdicion.stock}
                                        onChange={manejarCambioEdicion}
                                        error={erroresEdicion.stock}
                                    />

                                    <div className="flex gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => guardarEdicion(p.id_producto)}
                                            className="text-acento text-sm hover:underline cursor-pointer"
                                        >
                                            Guardar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditando(null)}
                                            className="text-texto-secundario text-sm hover:underline cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-texto font-medium">
                                        {p.nombre}
                                    </h3>

                                    <p className="text-texto-secundario text-sm mb-2">
                                        {p.descripcion}
                                    </p>

                                    <p className="text-texto-secundario text-sm">
                                        ${Number(p.precio).toLocaleString('es-CO')}
                                        {' · '}
                                        Stock: {p.stock}
                                    </p>

                                    <span
                                        className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                                            p.estado === 'activo'
                                                ? 'bg-acento/15 text-acento'
                                                : 'bg-borde/30 text-texto-secundario'
                                        }`}
                                    >
                                        {p.estado}
                                    </span>

                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={() => iniciarEdicion(p)}
                                            className="text-texto-secundario text-sm hover:text-acento cursor-pointer"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => alternarEstado(p)}
                                            className="text-texto-secundario text-sm hover:text-acento cursor-pointer"
                                        >
                                            {p.estado === 'activo'
                                                ? 'Desactivar'
                                                : 'Activar'}
                                        </button>

                                        <button
                                            onClick={() => eliminar(p.id_producto)}
                                            className="text-red-500 text-sm hover:underline cursor-pointer"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}