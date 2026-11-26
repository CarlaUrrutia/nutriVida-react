# Informe de brechas (gaps) — Evaluación 3: Aplicación Full Stack NutriVida

Fecha: 2026-07-21 (aprox.)
Alcance: revisión de solo lectura de:
- Frontend: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react`
- Backend: `C:\Users\urrut\OneDrive\Desktop\bd`

---

## Resumen ejecutivo

La base de ambos proyectos ya está bien encaminada y cumple gran parte de los requisitos 1, 2, 3 y 4, pero con un número limitado de entidades (Cliente, Profesional, Servicio) y con un vacío estructural: **no existe entidad de usuario/autenticación persistida** — el login funciona con dos usuarios hardcodeados en memoria (`admin`/`admin123` y `user`/`user123` en `UserDetailsServiceImpl.java`), y el registro de usuarios del frontend se guarda en `localStorage`, no en MySQL. Adicionalmente, faltan por completo los entregables administrativos (README con instrucciones, scripts SQL, PPT, Trello, repos GitHub) y no hay persistencia del carrito ni órdenes de compra. La API no tiene manejo de errores HTTP (un `findById` inexistente devuelve 200 con cuerpo vacío, un `delete` de un ID inexistente lanza 500).

**Estado por requisito (semáforo):**

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Spring Boot + MySQL, CRUD completo | 🟡 Casi completo — CRUD OK en 3 entidades, pero sin manejo de errores ni tabla de usuarios |
| 2 | API REST + Swagger | 🟢 Configurado (springdoc 2.8.8, Swagger UI con bearerAuth) — falta `@SecurityRequirement` a nivel de operación para el candado "Authorize" |
| 3 | Integración React ↔ backend | 🟡 Parcial — Productos/Panel usan Axios, pero registro, carrito, favoritos y perfil son localStorage/estado en memoria |
| 4 | Autenticación JWT + roles | 🟡 Funcional pero no persiste usuarios en BD; roles solo USER/ADMIN en memoria |
| 5 | Presentación/defensa | ⚠️ Depende de lo anterior |
| 6 | Entregables (ZIP, scripts SQL, PPT, GitHub, Trello, instrucciones) | 🔴 No encontrados en los proyectos |

---

## Requisito 1 — Backend: Spring Boot + MySQL, CRUD completo

### (a) Estado actual, con evidencia

**Conexión a MySQL (OK).**
- `bd/src/main/resources/application.properties` configura `spring.datasource.url=jdbc:mysql://localhost:3306/nutrivida`, usuario `root`, contraseña vacía, `ddl-auto=validate` y Flyway habilitado (`spring.flyway.enabled=true`, `classpath:db/migration`).
- `bd/pom.xml` incluye `mysql-connector-j` (runtime) y `flyway-core` + `flyway-mysql`.

**CRUD completo (OK para las 3 entidades).** Las tres entidades tienen GET (lista y por id), POST, PUT y DELETE:
- `bd/src/main/java/com/NutriVida/bd/controller/ClienteController.java` — `@GetMapping`, `@GetMapping("/{id}")`, `@PostMapping`, `@PutMapping("/{id}")`, `@DeleteMapping("/{id}")` sobre `/clientes`.
- `bd/src/main/java/com/NutriVida/bd/controller/ProfesionalController.java` — idéntico patrón sobre `/profesionales`.
- `bd/src/main/java/com/NutriVida/bd/controller/ServicioController.java` — idéntico patrón sobre `/servicios`.

Cada controller delega en su service (`ClienteService`, `ProfesionalService`, `ServicioService` en `bd/src/main/java/com/NutriVida/bd/service/`), que a su vez usan los repositories JPA (`ClienteRepository`, `ProfesionalRepository`, `ServicioRepository` en `bd/src/main/java/com/NutriVida/bd/repository/`, todos `JpaRepository<Entity, Long>` vacíos).

**Nota de versión:** el `pom.xml` declara parent `spring-boot-starter-parent` **4.1.2** con Java 21. Spring Boot 4.x es muy reciente; conviene verificar que el compilador/IDE local lo tenga resuelto (el `.idea/` sugiere IntelliJ ya lo trabajó). Los tests de service (`ClienteServiceTest`, etc. en `bd/src/test/java/com/NutriVida/bd/`) usan DataFaker 2.4.3.

**Reflejo en la base de datos.** `ddl-auto=validate` + Flyway garantizan que el esquema lo crea Flyway (ver Requisito 5). Las operaciones CRUD se reflejan en MySQL vía JPA — correcto.

### (b) Qué falta / está incompleto

1. **Sin manejo de errores HTTP.**
   - `findById` de una entidad inexistente devuelve `Optional` vacío serializado como `{}` con HTTP 200 — el frontend no puede distinguir "no existe".
   - `deleteById` de un ID inexistente lanza `EmptyResultDataAccessException` → 500 al cliente.
   - `update` de un ID inexistente **crea** un registro nuevo con ese ID (comportamiento de `save` en JPA), lo que puede corromper datos.
   - Eliminar un profesional con clientes asignados lanza `DataIntegrityViolationException` (FK `fk_cliente_profesional`) → 500; el frontend ya anticipa ese caso con un mensaje genérico (`PanelProfesionales.handleEliminar`), pero el backend no responde limpio.
   - No hay `@ControllerAdvice` / `GlobalExceptionHandler` en el paquete `bd/`.
2. **No hay entidad Usuario.** El paquete `model/` solo tiene Cliente, Profesional, Servicio. No existe tabla `usuario`, y por tanto no hay CRUD de usuarios contra la BD (ver Requisito 4).
3. **Solo 3 entidades.** No hay entidad para órdenes/compras, favoritos ni carrito — lo que limita "los cambios desde React se almacenan en MySQL" a las 3 entidades del panel de admin.

### (c) Qué habría que hacer (priorizado)

1. **Alta** — Agregar un `@RestControllerAdvice` (ej. `bd/src/main/java/com/NutriVida/bd/controller/GlobalExceptionHandler.java`) que mapee: `NoSuchElementException`/entidad no encontrada → 404, `DataIntegrityViolationException` → 409, `MethodArgumentNotValidException` → 400. Y en los services, que `findById`/`update`/`deleteById` lancen excepción de negocio si no existe el registro.
2. **Alta** — Crear entidad `Usuario` (ver Requisito 4) para persistir usuarios.
3. **Media** — Considerar entidades `Orden`/`OrdenDetalle` para persistir el carrito (hoy el "Finalizar compra" es solo un `alert`, ver Requisito 3).
4. **Baja** — Cambiar el campo suelto `Cliente.id_profesional` (Long) por una relación JPA `@ManyToOne` hacia `Profesional`, para evitar desincronización entre modelo y BD.

---

## Requisito 2 — API REST y Swagger/OpenAPI

### (a) Estado actual, con evidencia

- `bd/pom.xml` incluye `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.8`.
- `application.properties` define `springdoc.api-docs.path=/api-docs` y `springdoc.swagger-ui.path=/swagger-ui.html`.
- `bd/src/main/java/com/NutriVida/bd/config/SwaggerConfig.java` construye el OpenAPI con título "NutriVida API", versión 1.0.0, esquema de seguridad `bearerAuth` (HTTP bearer, formato JWT) y `SecurityRequirement` global.
- Todos los controllers usan `@Tag` y `@Operation` de swagger-annotations, con descripciones en español.
- Los métodos HTTP se usan correctamente: GET/POST/PUT/DELETE en las tres entidades (ver Requisito 1).
- `SecurityConfig` permite sin autenticación: `/auth/**`, `/swagger-ui/**`, `/swagger-ui.html`, `/api-docs/**`, `/v3/api-docs/**` — Swagger UI es accesible y `GET /servicios/**` es público.

### (b) Qué falta

1. **Advertencia de compatibilidad de versión:** springdoc 2.8.8 es la línea para Spring Boot 3.x; con el parent **Spring Boot 4.1.2** declarado en el pom puede haber incompatibilidad (Boot 4 cambió el artefacto/namespace de integración). Si al levantar el backend `/swagger-ui.html` da 404 o error de beans, esta es la causa probable. Verificar en runtime.
2. El `DELETE` no devuelve respuesta estructurada (void 200) — funcional pero poco documentable.
3. No hay DTOs para las entidades (los controllers exponen las entidades JPA directamente); suficiente para la entrega, pero el `Cliente` expone `id_profesional` crudo.

### (c) Qué hacer

1. **Alta (verificación, no código):** levantar el backend y confirmar `http://localhost:8080/swagger-ui.html` carga y permite ejecutar `POST /auth/login` → copiar token → botón "Authorize" → pegarlo → probar PUT/DELETE de clientes. Si springdoc no arranca con Boot 4, bajar el parent a Spring Boot 3.5.x (la más simple de las dos rutas) o subir springdoc a la versión compatible con Boot 4.
2. **Media:** agregar `@SecurityRequirement(name = "bearerAuth")` a nivel de controller en los tres CRUD controllers, para que Swagger muestre el candado por operación (hoy solo está como requisito global en `SwaggerConfig`, lo que suele bastar, pero el candado por operación queda más claro para la defensa).
3. **Baja:** documentar los códigos de respuesta (404/409) una vez agregado el manejo de errores del Requisito 1.

---

## Requisito 3 — Integración React + Spring Boot

### (a) Estado actual, con evidencia

**Servicios Axios contra `http://localhost:8080` (OK).**
- `src/services/ClienteService.js`, `src/services/ProfesionalService.js` y `src/services/ServicioService.js`: las 5 operaciones (getAll, getById, create, update, delete) con Axios; los tres primeros usan `authHeader()` de `src/services/authHeader.js` (Bearer token desde `localStorage.nutrivida_sesion`). `ServicioService.getAllServicios` y `getServicioById` van sin header (coherente: GET /servicios es público).
- `src/services/AuthService.js` hace `POST http://localhost:8080/auth/login`.
- El backend permite CORS para `http://localhost:5173` y `:3000` (`bd/src/main/java/com/NutriVida/bd/config/CorsConfig.java`), correcto para el dev server de Vite.

**Operaciones CRUD realmente conectadas:**
- **Planes/Servicios** — `src/context/ProductosContext.jsx` carga con `ServicioService.getAllServicios()`, y `agregarProducto`/`editarProducto`/`eliminarProducto` llaman a POST/PUT/DELETE y recargan. La vista `src/views/Productos.jsx` y la galería consumen este contexto. CRUD 100% contra la API. El mapeo `aProducto` usa `id_servicio` del backend.
- **Clientes** — `src/components/PanelClientes.jsx` (dentro de `src/views/Panel.jsx`, ruta `/admin`): listar, crear, editar, eliminar contra la API, con select de profesional cargado de `/profesionales`. CRUD 100% conectado.
- **Profesionales** — `src/components/PanelProfesionales.jsx`: CRUD 100% conectado.
- **Login** — `src/views/Login.jsx` → `AuthContext.iniciarSesion` → `AuthService.login` (JWT real, ver Requisito 4).

**NO conectadas (datos locales / estado en memoria):**
- **Registro** — `src/context/AuthContext.jsx` `registrarUsuario`: guarda el usuario en `localStorage['nutrivida_usuarios']`. Nunca toca el backend.
- **Carrito** — `src/context/CarritoContext.jsx`: solo `useState`; "Finalizar compra" en `src/views/Carrito.jsx` es un `alert('¡Compra realizada con éxito!')` y `vaciarCarrito()`. No persiste nada.
- **Favoritos** — `src/context/FavoritosContext.jsx`: contexto local (no revisado en detalle, pero no hay service asociado en `src/services/`).
- **Datos estáticos** — `src/data/productos.js` sigue existiendo pero **solo se usa como fuente de imágenes** en `ProductosContext.aProducto` (match por `nombre`); el catálogo real ya viene de la BD. No es un gap de datos, pero conviene saberlo para la defensa.

### (b) Qué falta

1. El registro de usuarios no llega a MySQL (el requisito pide "los cambios realizados desde React se almacenen y actualicen correctamente en MySQL").
2. El carrito no genera ninguna orden/compra en la BD.
3. `Producto.jsx` (vista de detalle) usa el id de servicio del backend — funciona, pero la navegación de favoritos depende del contexto local.

### (c) Qué hacer (priorizado)

1. **Alta** — Implementar `POST /auth/registro` en el backend (tabla `usuario`, contraseña con BCrypt) y que `registrarUsuario` llame por Axios; el login de usuarios registrados debe validar contra la BD. (Detalle en Requisito 4.)
2. **Media** — Entidades `Orden` + `OrdenDetalle` en el backend con `POST /ordenes` (rol USER/ADMIN), y que `handleFinalizar` en `Carrito.jsx` cree la orden antes de vaciar el carrito. Esto cierra el ciclo "React → MySQL" de punta a punta y es un muy buen punto de demostración.
3. **Baja** — Quitar el fallback de login por `localStorage` en `AuthContext.iniciarSesion` (usuarios registrados offline); con backend arriba confunde la demo.
4. **Baja** — Centralizar el `BASE_URL` (`http://localhost:8080`) en una constante única o variable de entorno de Vite (`import.meta.env.VITE_API_URL`); hoy está duplicada en 4 archivos.

---

## Requisito 4 — Autenticación JWT y autorización por roles

### (a) Estado actual, con evidencia

**Backend (funcional contra usuarios en memoria):**
- `bd/src/main/java/com/NutriVida/bd/controller/AuthController.java` — `POST /auth/login` usa `AuthenticationManager`, genera token con `JwtUtil.generateToken(username)` y devuelve `AuthResponse(token, username, rol)` (el rol se extrae de las authorities `ROLE_*`).
- `bd/src/main/java/com/NutriVida/bd/security/JwtUtil.java` — firma HMAC con `jwt.secret` de `application.properties`, expiración 24 h (`jwt.expiration=86400000`), validación de subject y expiración.
- `bd/src/main/java/com/NutriVida/bd/security/JwtAuthenticationFilter.java` — `OncePerRequestFilter` que lee `Authorization: Bearer ...`, carga el usuario, valida el token y popula el `SecurityContextHolder`.
- `bd/src/main/java/com/NutriVida/bd/security/UserDetailsServiceImpl.java` — **dos usuarios hardcodeados**: `admin/admin123` (ROLE_ADMIN) y `user/user123` (ROLE_USER), contraseñas BCrypt precalculadas en static.
- `bd/src/main/java/com/NutriVida/bd/security/SecurityConfig.java` — stateless, CSRF off, CORS on, y reglas:
  - `permitAll`: `/auth/**`, swagger, api-docs.
  - `GET /servicios/**` público.
  - `GET /clientes/**`, `/profesionales/**` → `hasAnyRole("USER","ADMIN")`.
  - `anyRequest()` → `hasRole("ADMIN")` (es decir, todos los POST/PUT/DELETE de las 3 entidades son solo ADMIN).
- No hay anotaciones `@PreAuthorize`; las reglas viven en `SecurityConfig` (equivalente y suficiente).

**Frontend (conectado, con detalles):**
- `src/views/Login.jsx` → `AuthContext.iniciarSesion` → `AuthService.login` → guarda `{username, rol, esAdmin, token}` en `localStorage['nutrivida_sesion']`.
- `src/services/authHeader.js` inyecta `Authorization: Bearer <token>` en las llamadas de clientes/profesionales y en create/update/delete de servicios.
- `src/components/RutaPrivada.jsx` redirige a login si no hay sesión, y a `/perfil` si no es admin (prop `soloAdmin` para `/admin`).
- Cierre de sesión: `cerrarSesion` borra `nutrivida_sesion` (persistencia y cierre de sesión OK a nivel de sesión).

**Problema detectado en el flujo USER:** el usuario con rol USER, tras el login, no tiene ninguna pantalla que consuma la API: es redirigido a `/perfil` (`MiPerfil.jsx`), que solo lee `favoritos` y datos del `usuario` en memoria. Los `GET /clientes` y `/profesionales` (permitidos a USER) no se usan desde ninguna vista accesible para USER. No es un error, pero en la defensa "restricciones de acceso según roles" quedará demostrado solo desde Swagger/curl salvo que se agregue algo.

### (b) Qué falta

1. **Persistencia de usuarios en BD (crítico).** `UserDetailsServiceImpl` dice literalmente: "Usuarios de demo en memoria. Para producción, reemplazar por consulta a BD." No hay tabla `usuario`, no hay `POST /auth/registro`, y el registro del frontend va a `localStorage`. Un usuario registrado desde React **no puede iniciar sesión** contra el backend (el login real solo acepta admin/user; el fallback local es un login falso).
2. **El secreto JWT está en el repo** (`jwt.secret=NutriVidaSecretKey...` en `application.properties`). Para un curso es tolerable; moverlo a variable de entorno sería mejor práctica.
3. No hay endpoint `/auth/registro` ni validación de unicidad de email.
4. El flujo USER no ejercita endpoints protegidos desde la UI.

### (c) Qué hacer (priorizado)

1. **Crítico** — Nueva migración `V4__usuarios.sql` (tabla `usuario`: id, username, email, password_hash, rol) + entidad `Usuario`, `UsuarioRepository`, `UsuarioService` con registro (BCrypt) y, sobre todo, reescribir `UserDetailsServiceImpl` para leer de la BD (inyectar el repository en vez de los estáticos). Agregar `POST /auth/registro` en `AuthController` y conectarlo desde `registrarUsuario` en `AuthContext.jsx` (nuevo método en `AuthService.js`). Sembrar en la migración el usuario `admin` con rol ADMIN para no perder el acceso.
2. **Alta** — Añadir en el frontend (por ejemplo en `MiPerfil` o una vista "Mis datos") un consumo visible para rol USER de un endpoint protegido (p. ej. `GET /clientes` con `authHeader()`), para demostrar la restricción por rol en la UI.
3. **Media** — Mover `jwt.secret` a variable de entorno (`JWT_SECRET`) manteniendo un default en `application.properties` para la demo.
4. **Baja** — Implementar blacklist/cierre de sesión server-side del token no es necesario (JWT stateless + borrado en cliente basta para la entrega).

---

## Requisito 5 — Base de datos: migraciones Flyway y seed

### (a) Estado actual, con evidencia

`bd/src/main/resources/db/migration/`:
- **`V1__init_schema.sql`** — crea `profesional` (id, nombre, apellido, especialidad, email), `cliente` (id, nombre, apellido, email, `id_profesional` FK → profesional) y `servicio` (id, nombre, descripcion, precio).
- **`V2__insert_sample_data.sql`** — seed: 3 profesionales, 3 clientes, 3 servicios.
- **`V3__planes_nutrivida.sql`** — borra los 3 servicios de V2 e inserta los 6 planes reales del negocio (Pérdida de Peso, Control Metabólico, Nutrición Deportiva, Nutrición Gestacional, Plan Adulto Mayor, TCA), coincidentes con `src/data/productos.js` del frontend (que ya no alimenta el catálogo, solo las imágenes).

`ddl-auto=validate` confirma que Flyway es el dueño del esquema. Datos de prueba: sí, presentes.

### (b) Qué falta

1. No hay tabla `usuario` (ver Requisito 4).
2. No hay tablas de órdenes/compras para persistir el carrito.
3. El entregable pide "scripts necesarios para crear y poblar la base de datos (independiente si utiliza Flyway)". Con Flyway ya cubierto, conviene incluir igual un `schema.sql`/`seed.sql` exportado (o indicar en el README que Flyway lo hace automáticamente).

### (c) Qué hacer

1. **Con V4 de usuarios** (Requisito 4) queda cubierto.
2. **Media** — Migración V5 con `orden`/`orden_detalle` si se implementa el flujo de compra.
3. **Alta (entregable)** — Exportar scripts SQL y README con pasos: crear BD `nutrivida`, usuario/contraseña, `mvn spring-boot:run`, `npm run dev`.

---

## Requisito 6 — Entregables

**No encontrados en ninguno de los dos proyectos:**
- README con instrucciones de ejecución (el `README.md` del frontend es el template de Vite; el backend no tiene README).
- Scripts SQL sueltos (cubierto de facto por Flyway, pero no como archivo entregable).
- Presentación PPT, enlace a GitHub (repositorios con push pendiente de verificar — `git` no está disponible en el PATH de este entorno, no pude inspeccionar el estado de los repos), Trello, ZIPs.

Qué hacer: redactar README(s) con instrucciones (puertos, credenciales demo, orden de arranque: MySQL → backend → frontend), exportar scripts, preparar PPT y verificar push de ambos repos.

---

## Pruebas existentes

- Backend: `BdApplicationTests.java`, `ClienteServiceTest.java`, `ProfesionalServiceTest.java`, `ServicioServiceTest.java` (con DataFaker). Comando: `.\mvnw.cmd test` en `C:\Users\urrut\OneDrive\Desktop\bd` (Maven wrapper presente).
- Frontend: `vitest` en `package.json` (`npm test`), con `src/setupTests.js` y un test de `Registro.test.jsx`. Comando: `npm run test` en `C:\Users\urrut\OneDrive\Desktop\nutriVida-react`.
- Postman: carpeta `postman/` (collections, environments, etc.) — vacía de contenido significativo según el listado; hay `.postman/resources.yaml`.

---

## Lista de gaps ordenados por criticidad para la entrega

1. **[CRÍTICO] Usuarios no persisten en MySQL.** Login solo contra `admin`/`user` hardcodeados (`UserDetailsServiceImpl.java`); el registro de React va a `localStorage`. → Migración V4 + entidad `Usuario` + `POST /auth/registro` + `UserDetailsServiceImpl` leyendo de BD + conectar `registrarUsuario` por Axios. Sin esto, "autenticación segura de usuarios" y "persistencia real" quedan cojas en la demo.
2. **[CRÍTICO] Entregables administrativos ausentes.** Sin README de ejecución, scripts SQL entregables, PPT, Trello ni verificación de push a GitHub.
3. **[ALTO] Spring Boot 4.1.2 + springdoc 2.8.8: compatibilidad sin verificar.** Confirmar en runtime que `/swagger-ui.html` abre y permite ejecutar los endpoints con el token; si falla, alinear versiones (Boot 3.5.x o springdoc compatible con Boot 4). Toda la demo de Swagger depende de esto.
4. **[ALTO] Sin manejo de errores HTTP en el backend.** `findById` inexistente → 200 vacío; `delete` inexistente → 500; FK violation → 500. → `@RestControllerAdvice` + validaciones en services.
5. **[MEDIO] Compra no persistida.** "Finalizar compra" es un `alert`; no hay orden en MySQL. → Entidades orden/orden_detalle + `POST /ordenes` + conectar `Carrito.jsx`.
6. **[MEDIO] Rol USER sin uso visible en la UI.** Ninguna pantalla de USER consume endpoints protegidos. → Agregar consumo autenticado (p. ej. listado de clientes) para demostrar restricción por rol.
7. **[BAJO] Calidad de código/seguridad:** `jwt.secret` commiteado; `BASE_URL` duplicada en 4 services; fallback de login local en `AuthContext`; `Cliente.id_profesional` como Long suelto en vez de relación JPA.
8. **[BAJO] Carrito y favoritos no persisten entre recargas/sesiones** (solo estado en memoria) — aceptable para la entrega, pero mencionable.

## Recomendación de orden de trabajo

1. Verificar Swagger con el backend arriba (gap 3) — condiciona la demo.
2. Implementar usuarios en BD + registro (gap 1) — es la pieza central que falta.
3. Manejo de errores (gap 4).
4. Orden de compra (gap 5) si hay tiempo.
5. README, scripts, PPT, push (gap 2) — dejarlo último pero con tiempo reservado; es lo que la evaluación pide explícitamente.
