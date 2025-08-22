# Proyecto Node.js + PostgreSQL - API REST Parcial 1

Este proyecto es una API REST en Node.js para gestionar empleados, proyectos y las asignaciones de empleados a proyectos.

Requisitos
- Node.js (>=14)
- PostgreSQL

Instalación y ejecución (local)
```powershell
npm install
# configurar variables de entorno en .env (conexión a Postgres, puerto, etc.)
npm run dev
```

Base de datos
- Ejecutar `script.sql` en tu base de datos PostgreSQL para crear las tablas necesarias.

Rutas principales

1) Empleados
- GET /empleados
  - Lista todos los empleados activos.
  - Body: No body
- GET /empleados/:id
  - Obtiene un empleado por `empleado_id`.
  - Body: No body
- POST /empleados
  - Crea un empleado.
  - Body (JSON):
    ```json
    {
      "nombre": "Juan Perez",
      "email": "juan@example.com",
      "telefono": "123456789",
      "direccion": "Calle Falsa 123",
      "fecha_nacimiento": "1990-01-01",
      "puesto": "Desarrollador",
      "salario": 1200.50
    }
    ```
- PUT /empleados/:id
  - Actualiza un empleado.
  - Body (JSON):
    ```json
    {
      "nombre": "Juan Perez",
      "email": "juan.updated@example.com",
      "telefono": "987654321",
      "direccion": "Calle Nueva 45",
      "fecha_nacimiento": "1990-01-01",
      "puesto": "Líder técnico",
      "salario": 1500
    }
    ```
- DELETE /empleados/:id
  - Eliminación lógica (se pone `estado = false`).

2) Proyectos
- GET /proyectos
  - Lista proyectos activos.
  - Body: No body
- GET /proyectos/:id
  - Obtiene un proyecto por `proyecto_id`.
  - Body: No body
- POST /proyectos
  - Crea un proyecto.
  - Body (JSON):
    ```json
    {
      "nombre": "Proyecto X",
      "descripcion": "Descripción breve del proyecto",
      "fecha_fin": "2025-12-31",
      "porcentaje_avance": 0
    }
    ```
- PUT /proyectos/:id
  - Actualiza un proyecto.
  - Body (JSON):
    ```json
    {
      "nombre": "Proyecto X - Actualizado",
      "descripcion": "Descripción actualizada",
      "fecha_inicio": "2025-01-01",
      "fecha_fin": "2025-12-31",
      "porcentaje_avance": 25.5
    }
    ```
- DELETE /proyectos/:id
  - Eliminación lógica (se pone `estado = false`).

3) Asignaciones (empleados <-> proyectos)
- GET /asignaciones
  - Lista todas las asignaciones con datos de empleado y proyecto.
  - Body: No body
- GET /asignaciones/:id
  - Obtiene una asignación por `asignacion_id`.
  - Body: No body
- GET /asignaciones/empleado/:empleado_id
  - Historial de asignaciones de un empleado.
  - Body: No body
- GET /asignaciones/proyecto/:proyecto_id
  - Empleados asignados a un proyecto.
  - Body: No body
- POST /asignaciones
  - Asigna un empleado a un proyecto.
  - Body (JSON):
    ```json
    {
      "empleado_id": 1,
      "proyecto_id": 2,
      "fecha_asignacion": "2025-08-22",
      "rol": "Desarrollador Frontend"
    }
    ```
  - Reglas de negocio importantes:
    - Un empleado sólo puede tener un proyecto activo a la vez (no puede existir una asignación sin `fecha_liberacion`).
    - Puede haber varios empleados en el mismo proyecto.
-- PUT /asignaciones/:id/liberar
  - Finaliza la asignación estableciendo `fecha_liberacion` (si no se envía, se usa la fecha actual).
  - Body (JSON):
    ```json
    { "fecha_liberacion": "2025-12-31" }
    ```
- PUT /asignaciones/:id/rol
  - Actualiza el `rol` de la asignación.
  - Body (JSON):
    ```json
    { "rol": "Líder de proyecto" }
    ```
