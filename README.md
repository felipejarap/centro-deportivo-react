# 🏋️‍♂️ Centro Deportivo Kronofit - Frontend (React + Vite)

Este proyecto corresponde a la interfaz frontend desarrollada en **React** y **Vite** para la plataforma de gestión del centro deportivo **Kronofit**.

---

## 🛠️ Requisitos Previos

Para ejecutar este proyecto de forma local, necesitas tener instalado Node.js y su gestor de paquetes npm. El proyecto ha sido configurado y verificado utilizando las siguientes versiones:

- **Node.js:** v26.13.0 (o superior)
- **npm:** v11.20.0
- **Bootstrap:** 5.3.8
- **React:** 19.3.1
- **Vite:** 8.3.5

---

## 📐 Arquitectura y Decisiones de Diseño

1. **Estructura Modular por Dominios:**
   - **`data/`:** Datos JSON base (`planes.json`, `tiposClases.json`) para simular las respuestas iniciales de los microservicios.
   - **`pages/planes/`:** Gestión del catálogo de ofertas y planes comerciales.
   - **`pages/clases/` y `pages/tiposClases/`:** Gestión de programación de clases y categorías.

2. **Diseño de Interfaz y UI Responsiva:**
   - Uso intensivo de **Bootstrap 5** para lograr una interfaz adaptable a dispositivos móviles y escritorio.
   - Componentes responsivos con validaciones en tiempo real para creación, edición y eliminación (CRUD).
   - Identificación visual de ofertas mediante insignias dinámicas (*"Más Popular"*).

3. **Gestión de Estado y Persistencia:**
   - Manejo de estado local mediante `useState` y `useEffect`.
   - Persistencia de datos en `localStorage` para garantizar la continuidad de la información en el navegador mientras se integra la API Gateway REST.

---
