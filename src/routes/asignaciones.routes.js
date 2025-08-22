import { Router } from "express";
import { 
    getAsignaciones, 
    getAsignacionById, 
    getAsignacionesByEmpleado,
    getAsignacionesByProyecto,
    postAsignacion, 
    liberarEmpleado,
    updateRolAsignacion
} from "../controllers/asignaciones.controller.js";

const router = Router();

router.get("/asignaciones", getAsignaciones);
router.get("/asignaciones/:id", getAsignacionById);
router.post("/asignaciones", postAsignacion);

// Obtener asignaciones por empleado
router.get("/asignaciones/empleado/:empleado_id", getAsignacionesByEmpleado);

// Obtener asignaciones por proyecto
router.get("/asignaciones/proyecto/:proyecto_id", getAsignacionesByProyecto);

// Liberar empleado de proyecto (establecer fecha de liberación)
router.put("/asignaciones/:id/liberar", liberarEmpleado);

// Actualizar rol en asignación
router.put("/asignaciones/:id/rol", updateRolAsignacion);

export default router;
