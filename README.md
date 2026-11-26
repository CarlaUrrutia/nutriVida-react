# NutriVida — Frontend (React)

Interfaz web de la plataforma de nutrición NutriVida. Desarrollada con React 19, Vite, React Router y Axios.

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 18            |
| npm         | 9             |

Además, el **backend debe estar corriendo** en `http://localhost:8080` (ver README del proyecto `bd`).

---

## Ejecutar el frontend

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Usuarios de prueba

| Usuario | Contraseña | Rol   |
|---------|-----------|-------|
| admin   | admin123  | ADMIN |
| user    | user123   | USER  |

---

## Estructura del proyecto

```
src/
├── components/    # GaleriaProductos, TarjetaProducto, Header, Footer,
│                  # RutaPrivada, PanelServicios, PanelClientes, PanelProfesionales
├── context/       # AuthContext, ProductosContext, CarritoContext, FavoritosContext
├── data/          # menu, productos (imágenes y textos del catálogo)
├── services/      # api.js (axios), AuthService, ServicioService, ClienteService,
│                  # ProfesionalService, OrdenService
└── views/         # Home, Productos, Producto, Carrito, Login, Registro,
                   # Panel (admin), MiPerfil
```

---

## Navegación

| Ruta | Vista | Acceso |
|------|-------|--------|
| `/` | Home | Público |
| `/productos` | Catálogo de planes | Público |
| `/producto/:id` | Detalle de un plan | Público |
| `/carrito` | Carrito de compra | Público (requiere sesión para finalizar) |
| `/login` | Iniciar sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/admin` | Panel de administración (CRUD) | Solo ADMIN |
| `/perfil` | Mi perfil / mis órdenes | USER / ADMIN |

---

## Integración con el backend

Todas las peticiones HTTP se hacen con **Axios** hacia `http://localhost:8080` (configurado en `src/services/api.js`).

Las rutas protegidas envían el token JWT en el header `Authorization: Bearer <token>` (ver `src/services/authHeader.js`).

La sesión persiste en `localStorage` (clave `nutrivida_sesion`) y se restaura al recargar la página.

---

## Funcionalidades

- Catálogo de planes nutricionales consumido desde el backend
- Carrito de compra que genera órdenes reales en la base de datos
- Login con JWT y roles USER/ADMIN
- Registro de nuevos usuarios (rol USER)
- Panel de administración con CRUD completo de planes, clientes y profesionales
- Vista "Mi Perfil" con el historial de órdenes del usuario
