import { useState, useEffect } from 'react'
import { obtenerServicios, crearServicio, editarServicio, cambiarEstadoServicio, eliminarServicio } from '../../services/servicioService.js'
import { Input } from '../ui/Input.jsx'
import { Button } from '../ui/Button.jsx'

const valoresIniciales = {
    nombre: '',
    descripcion: '',
    precio: '',
    duracion_estimada: '',
}

export const ServiciosCRUD = () => {
    const [servicios, setServicios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [nuevo, setNuevo] = useState(valoresIniciales)
    const [errores, setErrores] = useState({})
    const [editando, setEditando] = useState(null)
    const [formEdicion, setFormEdicion] = useState({})
    const [erroresEdicion, setErroresEdicion] = useState({})

    const cargar = async () => {
        setCargando(true)

        try {
            const data = await obtenerServicios()
            setServicios(data.servicios)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargar()
    }, [])

    const validarCampo = (nombre, valor) => {
        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/

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
                if (Number(valor) <= 0) {
                    return 'El precio debe ser mayor a 0.'
                }
                return ''

            case 'duracion_estimada':
                if (!valor.trim()) return 'La duración estimada es obligatoria.'
                if (valor.trim().length < 2 || valor.trim().length > 30) {
                    return 'Debe tener entre 2 y 30 caracteres.'
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
            await crearServicio({
                ...nuevo,
                nombre: nuevo.nombre.trim(),
                descripcion: nuevo.descripcion.trim(),
                duracion_estimada: nuevo.duracion_estimada.trim(),
                precio: Number(nuevo.precio)
            })

            setNuevo(valoresIniciales)
            setErrores({})
            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    const iniciarEdicion = (s) => {
        setEditando(s.id_servicio)

        setFormEdicion({
            nombre: s.nombre,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion_estimada: s.duracion_estimada
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
            nuevosErrores[campo] = validarCampo(
                campo,
                formEdicion[campo]
            )
        })

        setErroresEdicion(nuevosErrores)

        const hayErrores = Object.values(nuevosErrores).some(
            (mensaje) => mensaje !== ''
        )

        if (hayErrores) return

        try {
            await editarServicio(id, {
                ...formEdicion,
                nombre: formEdicion.nombre.trim(),
                descripcion: formEdicion.descripcion.trim(),
                duracion_estimada: formEdicion.duracion_estimada.trim(),
                precio: Number(formEdicion.precio)
            })

            setEditando(null)
            setErroresEdicion({})
            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    const alternarEstado = async (s) => {
        try {
            await cambiarEstadoServicio(
                s.id_servicio,
                s.estado === 'activo' ? 'inactivo' : 'activo'
            )

            cargar()
        } catch (err) {
            alert(err.message)
        }
    }

    const eliminar = async (id) => {
        if (!confirm('¿Eliminar este servicio?')) return

        try {
            await eliminarServicio(id)
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
                    Agregar nuevo servicio
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
                    label="Duración estimada"
                    name="duracion_estimada"
                    value={nuevo.duracion_estimada}
                    onChange={manejarCambioNuevo}
                    error={errores.duracion_estimada}
                    maxLength={30}
                />

                <Button type="submit">
                    Crear servicio
                </Button>
            </form>

            {cargando ? (
                <p className="text-texto-secundario">
                    Cargando servicios...
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {servicios.map((s) => (
                        <div
                            key={s.id_servicio}
                            className="bg-superficie rounded-lg p-4"
                        >
                            {editando === s.id_servicio ? (
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
                                        label="Duración estimada"
                                        name="duracion_estimada"
                                        value={formEdicion.duracion_estimada}
                                        onChange={manejarCambioEdicion}
                                        error={erroresEdicion.duracion_estimada}
                                        maxLength={30}
                                    />

                                    <div className="flex gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => guardarEdicion(s.id_servicio)}
                                            className="text-acento text-sm hover:underline cursor-pointer"
                                        >
                                            Guardar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditando(null)
                                                setErroresEdicion({})
                                            }}
                                            className="text-texto-secundario text-sm hover:underline cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-texto font-medium">
                                        {s.nombre}
                                    </h3>

                                    <p className="text-texto-secundario text-sm mb-2">
                                        {s.descripcion}
                                    </p>

                                    <p className="text-texto-secundario text-sm">
                                        ${Number(s.precio).toLocaleString('es-CO')}
                                        {' · '}
                                        {s.duracion_estimada}
                                    </p>

                                    <span
                                        className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                                            s.estado === 'activo'
                                                ? 'bg-acento/15 text-acento'
                                                : 'bg-borde/30 text-texto-secundario'
                                        }`}
                                    >
                                        {s.estado}
                                    </span>

                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={() => iniciarEdicion(s)}
                                            className="text-texto-secundario text-sm hover:text-acento cursor-pointer"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => alternarEstado(s)}
                                            className="text-texto-secundario text-sm hover:text-acento cursor-pointer"
                                        >
                                            {s.estado === 'activo'
                                                ? 'Desactivar'
                                                : 'Activar'}
                                        </button>

                                        <button
                                            onClick={() => eliminar(s.id_servicio)}
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