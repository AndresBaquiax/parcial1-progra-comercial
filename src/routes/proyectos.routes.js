import { Router } from "express";
import { 
    getProyectos, 
    getProyectoById, 
    postProyecto, 
    putProyecto, 
    deleteProyecto 
} from "../controllers/proyectos.controller.js";

const router = Router();

// Obtener todos los proyectos
router.get("/proyectos", getProyectos);

// Obtener un proyecto por ID
router.get("/proyectos/:id", getProyectoById);

// Crear un nuevo proyecto
router.post("/proyectos", postProyecto);

// Actualizar un proyecto
router.put("/proyectos/:id", putProyecto);

// Eliminar un proyecto (eliminación lógica)
router.delete("/proyectos/:id", deleteProyecto);

export default router;
