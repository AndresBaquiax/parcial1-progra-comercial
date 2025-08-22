import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes
import empleadosRoutes from './routes/empleados.routes.js';
import proyectosRoutes from './routes/proyectos.routes.js';
import asignacionesRoutes from './routes/asignaciones.routes.js';

dotenv.config();
const app = express();

//Settings
app.set('port', config.port);

//Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

//Routes
app.use(empleadosRoutes);
app.use(proyectosRoutes);
app.use(asignacionesRoutes);


export default app;