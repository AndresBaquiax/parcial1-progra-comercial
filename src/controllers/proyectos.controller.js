import { getConnection, querysProyectos } from "../database/index.js";

// --------------------- GET ALL PROYECTOS ---------------------
export const getProyectos = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysProyectos.getProyectos);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener proyectos",
            message: error.message 
        });
    }
};

// --------------------- GET PROYECTO BY ID ---------------------
export const getProyectoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validamos que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: "El ID debe ser un número válido" 
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysProyectos.getProyectoById, [id]);
        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Proyecto no encontrado" 
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener el proyecto",
            message: error.message 
        });
    }
};

// --------------------- POST PROYECTO ---------------------
export const postProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_fin, porcentaje_avance } = req.body;

        // Generamos fecha_inicio automáticamente (YYYY-MM-DD)
        const fecha_inicio = new Date().toISOString().split('T')[0];
        const fechaInicioDate = new Date(fecha_inicio);

        // Validamos los datos
        const porcentaje = porcentaje_avance || 0;
        const fechaFinDate = fecha_fin ? new Date(fecha_fin) : null;
        
        if (!nombre || 
            (fecha_fin && (isNaN(fechaFinDate.getTime()) || fechaFinDate <= fechaInicioDate)) ||
            (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysProyectos.postProyecto, [
            nombre,
            descripcion || null,
            fecha_inicio,
            fecha_fin || null,
            porcentaje
        ]);

        // Liberamos la conexion
        connection.release();

        res.status(201).json({
            message: "Proyecto creado exitosamente",
            proyecto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al crear el proyecto",
            message: error.message 
        });
    }
};

// --------------------- PUT PROYECTO ---------------------
export const putProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fecha_inicio, fecha_fin, porcentaje_avance } = req.body;

        // Validamos los datos
        const fechaInicioDate = new Date(fecha_inicio);
        const porcentaje = porcentaje_avance !== undefined ? porcentaje_avance : 0;
        const fechaFinDate = fecha_fin ? new Date(fecha_fin) : null;
        
        if (isNaN(id) || !nombre || !fecha_inicio || 
            isNaN(fechaInicioDate.getTime()) ||
            (fecha_fin && (isNaN(fechaFinDate.getTime()) || fechaFinDate <= fechaInicioDate)) ||
            (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysProyectos.putProyecto, [
            nombre,
            descripcion || null,
            fecha_inicio,
            fecha_fin || null,
            porcentaje,
            id
        ]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Proyecto no encontrado" 
            });
        }

        res.json({
            message: "Proyecto actualizado exitosamente",
            proyecto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al actualizar el proyecto",
            message: error.message 
        });
    }
};

// --------------------- DELETE PROYECTO (LÓGICO) ---------------------
export const deleteProyecto = async (req, res) => {
    try {
        const { id } = req.params;

        // Validamos que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: "El ID debe ser un número válido" 
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysProyectos.deleteProyecto, [id]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Proyecto no encontrado" 
            });
        }

        res.json({
            message: "Proyecto eliminado exitosamente",
            proyecto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al eliminar el proyecto",
            message: error.message 
        });
    }
};
