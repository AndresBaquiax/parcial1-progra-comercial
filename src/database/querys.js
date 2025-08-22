export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleados WHERE estado = true ORDER BY empleado_id",
    getEmpleadoById: "SELECT * FROM empleados WHERE empleado_id = $1 AND estado = true",
    postEmpleado: "INSERT INTO empleados (nombre, email, telefono, direccion, fecha_nacimiento, puesto, salario) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    putEmpleado: "UPDATE empleados SET nombre = $1, email = $2, telefono = $3, direccion = $4, fecha_nacimiento = $5, puesto = $6, salario = $7 WHERE empleado_id = $8 AND estado = true RETURNING *",
    deleteEmpleado: "UPDATE empleados SET estado = false WHERE empleado_id = $1 RETURNING *"
};

export const querysProyectos = {
    getProyectos: "SELECT * FROM proyectos WHERE estado = true ORDER BY proyecto_id",
    getProyectoById: "SELECT * FROM proyectos WHERE proyecto_id = $1 AND estado = true",
    postProyecto: "INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, porcentaje_avance) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    putProyecto: "UPDATE proyectos SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4, porcentaje_avance = $5 WHERE proyecto_id = $6 AND estado = true RETURNING *",
    deleteProyecto: "UPDATE proyectos SET estado = false WHERE proyecto_id = $1 RETURNING *"
};

export const querysAsignaciones = {
    getAsignaciones: `
        SELECT 
            ep.asignacion_id,
            ep.empleado_id,
            e.nombre as empleado_nombre,
            e.email as empleado_email,
            ep.proyecto_id,
            p.nombre as proyecto_nombre,
            ep.fecha_asignacion,
            ep.fecha_liberacion,
            ep.rol
        FROM empleados_proyectos ep
        INNER JOIN empleados e ON ep.empleado_id = e.empleado_id
        INNER JOIN proyectos p ON ep.proyecto_id = p.proyecto_id
        WHERE e.estado = true AND p.estado = true
        ORDER BY ep.asignacion_id
    `,

    getAsignacionById: `
        SELECT 
            ep.asignacion_id,
            ep.empleado_id,
            e.nombre as empleado_nombre,
            e.email as empleado_email,
            ep.proyecto_id,
            p.nombre as proyecto_nombre,
            ep.fecha_asignacion,
            ep.fecha_liberacion,
            ep.rol
        FROM empleados_proyectos ep
        INNER JOIN empleados e ON ep.empleado_id = e.empleado_id
        INNER JOIN proyectos p ON ep.proyecto_id = p.proyecto_id
        WHERE ep.asignacion_id = $1 AND e.estado = true AND p.estado = true
    `,
    
    checkEmpleadoProyectoActivo: `
        SELECT ep.*, p.nombre as proyecto_nombre
        FROM empleados_proyectos ep
        INNER JOIN proyectos p ON ep.proyecto_id = p.proyecto_id
        WHERE ep.empleado_id = $1 AND ep.fecha_liberacion IS NULL AND p.estado = true
    `,
    
    getAsignacionesByEmpleado: `
        SELECT 
            ep.asignacion_id,
            ep.proyecto_id,
            p.nombre as proyecto_nombre,
            ep.fecha_asignacion,
            ep.fecha_liberacion,
            ep.rol
        FROM empleados_proyectos ep
        INNER JOIN proyectos p ON ep.proyecto_id = p.proyecto_id
        WHERE ep.empleado_id = $1 AND p.estado = true
        ORDER BY ep.fecha_asignacion DESC
    `,
    
    getAsignacionesByProyecto: `
        SELECT 
            ep.asignacion_id,
            ep.empleado_id,
            e.nombre as empleado_nombre,
            e.email as empleado_email,
            ep.fecha_asignacion,
            ep.fecha_liberacion,
            ep.rol
        FROM empleados_proyectos ep
        INNER JOIN empleados e ON ep.empleado_id = e.empleado_id
        WHERE ep.proyecto_id = $1 AND e.estado = true
        ORDER BY ep.fecha_asignacion DESC
    `,
    
    postAsignacion: "INSERT INTO empleados_proyectos (empleado_id, proyecto_id, fecha_asignacion, rol) VALUES ($1, $2, $3, $4) RETURNING *",
    liberarEmpleado: "UPDATE empleados_proyectos SET fecha_liberacion = $1 WHERE asignacion_id = $2 RETURNING *",
    updateRolAsignacion: "UPDATE empleados_proyectos SET rol = $1 WHERE asignacion_id = $2 RETURNING *"
};