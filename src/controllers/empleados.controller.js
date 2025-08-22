import { getConnection, querysEmpleados } from "../database/index.js";

// --------------------- GET ALL EMPLEADOS ---------------------
export const getEmpleados = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysEmpleados.getEmpleados);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener empleados",
            message: error.message 
        });
    }
};

// --------------------- GET EMPLEADO BY ID ---------------------
export const getEmpleadoById = async (req, res) => {
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
        const result = await connection.query(querysEmpleados.getEmpleadoById, [id]);
        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Empleado no encontrado" 
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener el empleado",
            message: error.message 
        });
    }
};

// --------------------- POST EMPLEADO ---------------------
export const postEmpleado = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { nombre, email, telefono, direccion, fecha_nacimiento, puesto, salario } = req.body;

        // Validamos los datos obligatorios
        if (!nombre || !email || !emailRegex.test(email) || (salario && (isNaN(salario) || salario < 0))) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysEmpleados.postEmpleado, [
            nombre,
            email,
            telefono || null,
            direccion || null,
            fecha_nacimiento || null,
            puesto || null,
            salario || null
        ]);

        // Liberamos la conexion
        connection.release();

        res.status(201).json({
            message: "Empleado creado exitosamente",
            empleado: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al crear el empleado",
            message: error.message 
        });
    }
};

// --------------------- PUT EMPLEADO ---------------------
export const putEmpleado = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { id } = req.params;
        const { nombre, email, telefono, direccion, fecha_nacimiento, puesto, salario } = req.body;

        // Validamos los datos obligatorios
        if (!nombre || !email || isNaN(id) || (!emailRegex.test(email)) || salario && (isNaN(salario) || salario < 0)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: error.message
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysEmpleados.putEmpleado, [
            nombre,
            email,
            telefono || null,
            direccion || null,
            fecha_nacimiento || null,
            puesto || null,
            salario || null,
            id
        ]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Empleado no encontrado" 
            });
        }

        res.json({
            message: "Empleado actualizado exitosamente",
            empleado: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al crear el empleado",
            message: error.message 
        });
    }
};

// --------------------- DELETE EMPLEADO (BORRADO LÓGICO) ---------------------
export const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ 
                error: "Bad Request", 
                message: "El ID debe ser un número válido" 
            });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysEmpleados.deleteEmpleado, [id]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "Empleado no encontrado" 
            });
        }

        res.json({
            message: "Empleado eliminado exitosamente",
            empleado: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al eliminar el empleado",
            message: error.message 
        });
    }
};