# Centro Deportivo KRONOFIT

Aplicacion web frontend para administrar un centro deportivo: usuarios, roles, clases, reservas, planes y suscripciones.

El proyecto esta construido con React y Vite. La interfaz utiliza clases utilitarias de Tailwind CSS y los datos de demostracion se guardan en `localStorage`.

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

Vite mostrara en la terminal la URL local, normalmente `http://localhost:5173`.

Para crear una compilacion de produccion:

```bash
npm run build
```

## Cuentas de demostracion

Todas usan la contraseña `password123`:

| Rol           | Correo                         |
| ------------- | ------------------------------ |
| Administrador | `admin@kronofit.com`         |
| Profesor      | `carlos.rivera@kronofit.com` |
| Alumno        | `camila.soto@gmail.com`      |

## Estructura principal

```text
src/
  components/       Componentes reutilizables de la interfaz
  context/          Estado global y persistencia de la aplicacion
  data/             Datos iniciales de demostracion
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
