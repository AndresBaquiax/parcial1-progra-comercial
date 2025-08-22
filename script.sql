CREATE TABLE empleados (
    empleado_id    BIGSERIAL PRIMARY KEY,
    nombre  VARCHAR(50) NOT NULL,
    email          VARCHAR(100) UNIQUE NOT NULL,
    telefono       VARCHAR(20),
    direccion      VARCHAR(150),
    fecha_nacimiento DATE,
    puesto         VARCHAR(100),
    salario        NUMERIC(12,2),
    fecha_contratacion DATE NOT NULL DEFAULT CURRENT_DATE,
    estado         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE proyectos (
    proyecto_id     BIGSERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    descripcion     TEXT,
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE,
	porcentaje_avance NUMERIC(5,2) DEFAULT 0,
    estado          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE empleados_proyectos (
    asignacion_id    BIGSERIAL PRIMARY KEY,
    empleado_id      BIGINT NOT NULL REFERENCES empleados(empleado_id),
    proyecto_id      BIGINT NOT NULL REFERENCES proyectos(proyecto_id),
    fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_liberacion DATE,
    rol              VARCHAR(50)
);
