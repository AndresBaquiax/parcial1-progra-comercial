import { getConnection, querysAsignaciones, querysEmpleados, querysProyectos } from "../database/index.js";

// --------------------- GET ALL ASIGNACIONES ---------------------
export const getAsignaciones = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysAsignaciones.getAsignaciones);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener asignaciones",
            message: error.message 
        });
    }
};

// --------------------- GET ASIGNACION BY ID ---------------------
export const getAsignacionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validamos que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysAsignaciones.getAsignacionById, [id]);
        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Asignación no encontrada" 
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener la asignación",
            message: error.message 
        });
    }
};

// --------------------- GET ASIGNACIONES BY EMPLEADO ---------------------
export const getAsignacionesByEmpleado = async (req, res) => {
    try {
        const { empleado_id } = req.params;

        // Validamos que el ID sea un número
        if (isNaN(empleado_id)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysAsignaciones.getAsignacionesByEmpleado, [empleado_id]);
        // Liberamos la conexion
        connection.release();

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener asignaciones del empleado",
            message: error.message 
        });
    }
};

// --------------------- GET ASIGNACIONES BY PROYECTO ---------------------
export const getAsignacionesByProyecto = async (req, res) => {
    try {
        const { proyecto_id } = req.params;

        // Validamos que el ID sea un número
        if (isNaN(proyecto_id)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysAsignaciones.getAsignacionesByProyecto, [proyecto_id]);
        // Liberamos la conexion
        connection.release();

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener asignaciones del proyecto",
            message: error.message 
        });
    }
};

// --------------------- POST ASIGNACION ---------------------
export const postAsignacion = async (req, res) => {
    try {
        const { empleado_id, proyecto_id, fecha_asignacion, rol } = req.body;

        // Validamos los datos
        const fechaAsignacion = fecha_asignacion || new Date().toISOString().split('T')[0];
        const fechaAsignacionDate = new Date(fechaAsignacion);
        
        if (!empleado_id || !proyecto_id || 
            isNaN(empleado_id) || isNaN(proyecto_id) ||
            isNaN(fechaAsignacionDate.getTime())) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        try {
            // Verificamos que el empleado existe y está activo
            const empleadoResult = await connection.query(querysEmpleados.getEmpleadoById, [empleado_id]);
            if (empleadoResult.rows.length === 0) {
                connection.release();
                return res.status(404).json({ 
                    error: "Not Found", 
                    message: "Empleado no encontrado o inactivo" 
                });
            }

            // Verificamos que el proyecto existe y está activo
            const proyectoResult = await connection.query(querysProyectos.getProyectoById, [proyecto_id]);
            if (proyectoResult.rows.length === 0) {
                connection.release();
                return res.status(404).json({ 
                    error: "Not Found", 
                    message: "Proyecto no encontrado o inactivo" 
                });
            }

            // Verificamos que el empleado no tenga un proyecto activo
            const proyectoActivoResult = await connection.query(querysAsignaciones.checkEmpleadoProyectoActivo, [empleado_id]);
            if (proyectoActivoResult.rows.length > 0) {
                connection.release();
                return res.status(409).json({ 
                    error: "Conflict", 
                    message: `El empleado ya está asignado al proyecto: ${proyectoActivoResult.rows[0].proyecto_nombre}` 
                });
            }

            // Ejecutamos la consulta de asignación
            const result = await connection.query(querysAsignaciones.postAsignacion, [
                empleado_id,
                proyecto_id,
                fechaAsignacion,
                rol || null
            ]);

            // Liberamos la conexion
            connection.release();

            res.status(201).json({
                message: "Asignación creada exitosamente",
                asignacion: result.rows[0]
            });

        } catch (queryError) {
            connection.release();
            throw queryError;
        }

    } catch (error) {
        if (error.code === '23503') { // Error de clave foránea
            res.status(400).json({ 
                error: "Bad Request", 
                message: "El empleado o proyecto especificado no existe" 
            });
        } else {
            res.status(500).json({ 
                error: "Error al crear la asignación",
                message: error.message 
            });
        }
    }
};

// --------------------- PUT LIBERAR EMPLEADO ---------------------
export const liberarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_liberacion } = req.body;

        // Validamos los datos
        const fechaLiberacion = fecha_liberacion || new Date().toISOString().split('T')[0];
        const fechaLiberacionDate = new Date(fechaLiberacion);
        
        if (isNaN(id) || isNaN(fechaLiberacionDate.getTime())) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysAsignaciones.liberarEmpleado, [fechaLiberacion, id]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Asignación no encontrada" 
            });
        }

        res.json({
            message: "Empleado liberado del proyecto exitosamente",
            asignacion: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al liberar el empleado",
            message: error.message 
        });
    }
};

// --------------------- PUT UPDATE ROL ---------------------
export const updateRolAsignacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        // Validamos los datos
        if (isNaN(id) || !rol) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysAsignaciones.updateRolAsignacion, [rol, id]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Asignación no encontrada" 
            });
        }

        res.json({
            message: "Rol actualizado exitosamente",
            asignacion: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al actualizar el rol",
            message: error.message 
        });
    }
};
