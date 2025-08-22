# Proyecto Node.js + PostgreSQL - API de Gestión

Este proyecto es una API REST en Node.js para gestionar empleados, proyectos y las asignaciones de empleados a proyectos.

Archivos importantes:
- `script.sql` - Script de creación de las tablas (`empleados`, `proyectos`, `empleados_proyectos`).
- `src/` - Código fuente con controladores y rutas.
  - `src/controllers/empleados.controller.js`
  - `src/controllers/proyectos.controller.js`
  - `src/controllers/asignaciones.controller.js`
  - `src/routes/empleados.routes.js`
  - `src/routes/proyectos.routes.js`
  - `src/routes/asignaciones.routes.js`

Requisitos
- Node.js (>=14)
- PostgreSQL

Instalación y ejecución (local)
```powershell
npm install
# configurar variables de entorno en .env (conexión a Postgres, puerto, etc.)
npm start
```

Base de datos
- Ejecuta `script.sql` en tu base de datos PostgreSQL para crear las tablas necesarias.
- Las tablas utilizan un campo `estado` en `empleados` y `proyectos` para eliminación lógica.

Rutas principales

1) Empleados
- GET /empleados
  - Lista todos los empleados activos.
- GET /empleados/:id
  - Obtiene un empleado por `empleado_id`.
- POST /empleados
  - Crea un empleado.
  - Body (JSON):
    - `nombre` (string, obligatorio)
    - `email` (string, obligatorio, único)
    - `telefono` (string, opcional)
    - `direccion` (string, opcional)
    - `fecha_nacimiento` (YYYY-MM-DD, opcional)
    - `puesto` (string, opcional)
    - `salario` (number, opcional)
- PUT /empleados/:id
  - Actualiza un empleado.
  - Body igual que POST.
- DELETE /empleados/:id
  - Eliminación lógica (se pone `estado = false`).

Ejemplo crear empleado (curl):
```bash
curl -X POST http://localhost:3000/empleados \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Perez","email":"juan@example.com","puesto":"Developer"}'
```

2) Proyectos
- GET /proyectos
  - Lista proyectos activos.
- GET /proyectos/:id
  - Obtiene un proyecto por `proyecto_id`.
- POST /proyectos
  - Crea un proyecto. `fecha_inicio` se genera automáticamente con la fecha actual.
  - Body (JSON):
    - `nombre` (string, obligatorio)
    - `descripcion` (string, opcional)
    - `fecha_fin` (YYYY-MM-DD, opcional)
    - `porcentaje_avance` (number 0-100, opcional)
- PUT /proyectos/:id
  - Actualiza un proyecto.
  - Body (JSON):
    - `nombre`, `descripcion`, `fecha_inicio` (YYYY-MM-DD), `fecha_fin`, `porcentaje_avance`
- DELETE /proyectos/:id
  - Eliminación lógica (se pone `estado = false`).

Ejemplo crear proyecto (curl):
```bash
curl -X POST http://localhost:3000/proyectos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Proyecto X","descripcion":"Descripción"}'
```

3) Asignaciones (empleados <-> proyectos)
- GET /asignaciones
  - Lista todas las asignaciones con datos de empleado y proyecto.
- GET /asignaciones/:id
  - Obtiene una asignación por `asignacion_id`.
- GET /asignaciones/empleado/:empleado_id
  - Historial de asignaciones de un empleado.
- GET /asignaciones/proyecto/:proyecto_id
  - Empleados asignados a un proyecto.
- POST /asignaciones
  - Asigna un empleado a un proyecto.
  - Body (JSON):
    - `empleado_id` (number, obligatorio)
    - `proyecto_id` (number, obligatorio)
    - `fecha_asignacion` (YYYY-MM-DD, opcional; si no se envía se usa la fecha actual)
    - `rol` (string, opcional)
  - Reglas de negocio importantes:
    - Un empleado sólo puede tener un proyecto activo a la vez (no puede existir una asignación sin `fecha_liberacion`).
    - Puede haber varios empleados en el mismo proyecto.
- PUT /asignaciones/:id/liberar
  - Finaliza la asignación estableciendo `fecha_liberacion` (si no se envía, se usa la fecha actual).
  - Body: `{ "fecha_liberacion": "YYYY-MM-DD" }` (opcional)
- PUT /asignaciones/:id/rol
  - Actualiza el `rol` de la asignación.
  - Body: `{ "rol": "Nuevo rol" }`

Ejemplo asignar empleado (curl):
```bash
curl -X POST http://localhost:3000/asignaciones \
  -H "Content-Type: application/json" \
  -d '{"empleado_id":1,"proyecto_id":2,"rol":"Frontend"}'
```

Errores y respuestas
- Las rutas devuelven códigos HTTP adecuados: 200, 201, 400, 404, 409, 500.
- Las respuestas de error contienen la descripción del error en texto (mensaje de la excepción).

Notas finales
- Revisa `src/database/querys.js` para ver las consultas SQL usadas por los controladores.
- Ajusta las variables de entorno en el archivo de configuración para apuntar a tu base de datos.

Si quieres, puedo agregar ejemplos con Postman o un archivo `env.example` con las variables necesarias.
