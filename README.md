# Centro Deportivo KRONOFIT

Aplicacion web frontend para administrar un centro deportivo: usuarios, roles, clases, reservas, planes y suscripciones.

El proyecto esta construido con React y Vite. Los datos se consultan y actualizan mediante el API Gateway de Spring Boot. La sesion usa un token JWT almacenado en `localStorage`.

## Requisitos

- Node.js 20 o superior
- npm

## Instalacion

Desde la carpeta del proyecto:

```bash
npm install
```

## Ejecutar la aplicacion

```bash
npm run dev
```

Vite muestra la URL local, normalmente `http://localhost:5173`, y reenvia `/api` a `http://localhost:8090`. Inicia antes el backend y sus microservicios.

Para apuntar a otro Gateway, crea un archivo `.env.local` con:

```text
VITE_API_URL=http://localhost:8090/api/v1
```

En produccion configura `VITE_API_URL` con la URL publica del Gateway y `CORS_ALLOWED_ORIGINS` en `ms-apiGateway`.

Para crear una compilacion de produccion:

```bash
npm run build
```

## Autenticacion

El inicio de sesion usa `POST /api/v1/auth/login`; el registro crea un usuario Alumno y sus credenciales en el backend. Las solicitudes autenticadas envian `Authorization: Bearer <token>`. El token se elimina al cerrar sesion o cuando el Gateway responde `401`.

La migracion inicial del backend incluye `admin` / `admin123`. Cambia esa credencial antes de exponer el sistema.

## Estructura principal

```text
src/
  components/       Componentes reutilizables de la interfaz
  context/          Estado global y operaciones remotas del backend
  data/             Datos iniciales de demostracion
  services/         Cliente fetch del API y adaptadores de DTO
  pages/            Vistas publicas y paneles por rol
  utils/            Validadores y funciones auxiliares
tests/
  validators.test.js Pruebas de validacion con Vitest
  karma/              Pruebas Jasmine/Karma de validadores y componentes
```

## Pruebas

El proyecto tiene dos suites:

### Vitest

Ejecuta las pruebas de validadores. Actualmente contiene 20 pruebas.

```bash
npm run test:run
```

### Jasmine y Karma

Ejecuta las pruebas en `jsdom`. Incluye 20 pruebas unitarias de validadores y 10 pruebas directas de componentes React usando React Testing Library.

```bash
npm run test:karma
```

Esta suite usa los mocks de `tests/karma/mocks/` y la configuracion de `karma.conf.cjs`.

Karma genera los reportes en `coverage/karma/`:

- `coverage/karma/html/`: reporte HTML navegable.
- `coverage/karma/lcov.info`: reporte LCOV.
- Resumen de porcentajes en la terminal.

### Ejecutar todas las pruebas

```bash
npm run test:all
```

El ultimo resultado validado fue:

```text
Vitest: 20 pruebas exitosas
Jasmine/Karma: 30 pruebas exitosas
Statements: 90.47%
Lines: 90.36%
Branches: 81.65%
Functions: 85.71%
```
