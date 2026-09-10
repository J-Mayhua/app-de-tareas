# 📝 App de Tareas — Full-Stack Task Manager

Aplicación web de gestión de tareas construida como proyecto de aprendizaje Full-Stack. Permite crear una cuenta, organizar tareas en libretas, clasificarlas con etiquetas y prioridad, y llevar seguimiento de fechas límite — con una sección dedicada a tareas atrasadas.

![Dashboard preview](docs/image.png)

## 🛠️ Tecnologías

**Frontend**
- React 18 + Vite
- React Router (ruteo del lado del cliente)
- Tailwind CSS (estilos con utilidades)

**Backend**
- Node.js + Express
- PostgreSQL (base de datos relacional)
- JWT (autenticación basada en tokens)
- bcrypt (hash de contraseñas)
- express-validator (validación de datos)

**Herramientas**
- Git + GitHub (control de versiones)
- Postman / Thunder Client (pruebas de API)

## ✨ Funcionalidades

- 🔐 Registro e inicio de sesión con JWT
- ✅ CRUD completo de tareas (crear, listar, editar, eliminar)
- 📁 Libretas para organizar tareas por contexto
- 🏷️ Etiquetas múltiples por tarea (relación muchos-a-muchos)
- 🎯 Prioridad (baja / media / alta)
- 📅 Fecha límite con hora
- 📊 Estados de tarea: pendiente / en proceso / completada
- ⚠️ Sección de tareas atrasadas
- 🔒 Autorización: cada usuario solo ve y modifica sus propios datos

## 📂 Estructura del proyecto

```
app-de-tareas/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexión a DB, variables de entorno, migraciones SQL
│   │   ├── controllers/     # Lógica de negocio de cada endpoint
│   │   ├── middlewares/     # Autenticación JWT
│   │   └── routes/          # Definición de endpoints
│   ├── index.js              # Punto de entrada del servidor
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Piezas reutilizables (Layout, Navbar, ProtectedRoute)
│   │   ├── pages/            # Vistas (Login, Register, Dashboard)
│   │   └── services/         # Comunicación con la API (fetch)
│   └── index.html
│
└── README.md
```

## ⚙️ Instalación y uso local

### Requisitos previos
- Node.js (v18 o superior)
- PostgreSQL instalado y corriendo localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/J-Mayhua/app-de-tareas.git
cd app-de-tareas
```

### 2. Configurar la base de datos

Crea una base de datos vacía:

```bash
psql -U postgres -c "CREATE DATABASE task_app_db;"
```

Ejecuta el schema inicial y luego la migración:

```bash
cd backend
psql -U postgres -d task_app_db -f src/config/schema.sql
psql -U postgres -d task_app_db -f src/config/migration_v2.sql
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus credenciales reales de PostgreSQL y un JWT_SECRET propio
npm run dev
```

El servidor corre en `http://localhost:3000`.

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La app corre en `http://localhost:5173`.

## 🔌 Documentación de la API

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

### Auth

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Crea un usuario nuevo |
| POST | `/api/auth/login` | Inicia sesión, devuelve un JWT |

### Tareas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tasks` | Lista las tareas del usuario autenticado |
| POST | `/api/tasks` | Crea una tarea |
| PUT | `/api/tasks/:id` | Actualiza una tarea (parcial) |
| DELETE | `/api/tasks/:id` | Elimina una tarea |
| POST | `/api/tasks/:id/tags` | Asocia una etiqueta a una tarea |
| DELETE | `/api/tasks/:id/tags/:tagId` | Quita una etiqueta de una tarea |

### Libretas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/lists` | Lista las libretas del usuario |
| POST | `/api/lists` | Crea una libreta |
| PUT | `/api/lists/:id` | Actualiza una libreta |
| DELETE | `/api/lists/:id` | Elimina una libreta |

### Etiquetas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tags` | Lista las etiquetas del usuario |
| POST | `/api/tags` | Crea una etiqueta |

## 🗄️ Modelo de datos

```
users (1) ──── (N) tasks (N) ──── (N) tags   [vía task_tags]
  │                  │
  └── (1) ──── (N) lists
```

- Un usuario tiene muchas tareas, libretas y etiquetas.
- Una tarea puede pertenecer a una libreta (opcional).
- Una tarea puede tener varias etiquetas, y una etiqueta puede estar en varias tareas (relación muchos-a-muchos vía tabla intermedia `task_tags`).

## 🎓 Decisiones técnicas y aprendizajes

- **JWT sobre sesiones**: se eligió autenticación stateless con JWT por ser el estándar en APIs REST consumidas por SPAs, evitando que el backend deba guardar estado de sesión.
- **Token en `localStorage`**: elegido por simplicidad para el alcance del proyecto. En un entorno de producción a mayor escala, se consideraría el uso de cookies `httpOnly` para mitigar riesgos de XSS.
- **Validación en dos capas**: `express-validator` en el backend (la única confiable) más restricciones `CHECK`/`REFERENCES` a nivel de base de datos como última línea de defensa.
- **`ON DELETE SET NULL` vs `CASCADE`**: se usó `CASCADE` para la relación usuario→tareas (si se borra el usuario, no tiene sentido conservar sus tareas), pero `SET NULL` para libreta→tareas (borrar una libreta no debe destruir las tareas que contenía).

## 🔮 Mejoras futuras

- Notificaciones push reales para tareas próximas a vencer
- Subtareas / checklist dentro de una tarea
- Búsqueda y filtros avanzados (por prioridad, libreta, etiqueta combinados)
- Modo claro/oscuro
- Tests automatizados (backend con Jest/Supertest, frontend con Vitest)
- Despliegue en producción (backend en Render, frontend en Vercel, DB en Supabase/Neon)

## 👤 Autor

Desarrollado por Jose Adolfo Mayhua Palomino como proyecto de aprendizaje Full-Stack.

- GitHub: [@J-Mayhua](https://github.com/J-Mayhua)
