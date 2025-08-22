import { Router } from "express";
import { 
    getEmpleados, 
    getEmpleadoById, 
    postEmpleado, 
    putEmpleado, 
    deleteEmpleado 
} from "../controllers/empleados.controller.js";

const router = Router();

// Obtener todos los empleados
router.get("/empleados", getEmpleados);

// Obtener un empleado por ID
router.get("/empleados/:id", getEmpleadoById);

// Crear un nuevo empleado
router.post("/empleados", postEmpleado);

// Actualizar un empleado
router.put("/empleados/:id", putEmpleado);

// Eliminar un empleado (eliminación lógica)
router.delete("/empleados/:id", deleteEmpleado);

export default router;