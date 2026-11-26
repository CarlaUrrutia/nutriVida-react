# Implementation Plan — NutriVida Entrega 3 Full Stack

## Hallazgos de exploración

| Área | Estado actual | Acción requerida |
|---|---|---|
| springdoc-openapi 2.8.8 | Incompatible con Spring Boot 4.1.2 (necesita 3.x) | Subir a 3.2.0 en pom.xml |
| SwaggerConfig | Ya registra `bearerAuth` como global — todos los endpoints ya muestran el candado | No agregar `@SecurityRequirement` por controller (sería redundante) |
| UserDetailsServiceImpl | Usuarios hardcodeados en memoria | Reescribir para leer de BD |
| AuthController | Solo tiene `/login` | Agregar `POST /auth/registro` |
| Services CRUD | `update` llama a `save` sin verificar existencia; `deleteById` no lanza si no existe | Agregar chequeo con `findById` antes de update/delete |
| GlobalExceptionHandler | No existe | Crear en `controller/` |
| Tablas usuario / orden | No existen en BD | Migraciones V4 y V5 |
| AuthContext.jsx | Registro 100% local (localStorage), login con fallback local | Conectar al backend; eliminar fallback local |
| Registro.test.jsx | Espera `alert('Registro exitoso!')` y `{exito:true}` síncrono | Mantener compatibilidad haciendo `registrarUsuario` async y ajustando Registro.jsx |
| Carrito.jsx | `Finalizar compra` solo hace `alert` | Llamar a `OrdenService.crearOrden` |
| MiPerfil.jsx | Sin sección de órdenes | Agregar sección "Mis Órdenes" con GET /ordenes/mias |
| api.js centralizado | No existe; cada service tiene su propia URL hardcoded | Crear `src/services/api.js` e importar en todos los services |

---

## FEAT-001 — Springdoc 3.x + corrección de servicios CRUD (backend, base)

Este FEAT no tiene dependencias de los otros y debe ir primero porque un compile fallido
bloquea todo lo demás.

### Paso 1 — Subir springdoc a 3.2.0 en pom.xml

Archivo: `C:\Users\urrut\OneDrive\Desktop\bd\pom.xml`

Cambiar:
```xml
<version>2.8.8</version>
```
Por:
```xml
<version>3.2.0</version>
```

> Springdoc major version sigue el major de Spring Boot: 2.x → Boot 3.x; 3.x → Boot 4.x.
> Las releases del proyecto lo confirman: v3.2.0 se construye sobre Spring Boot 4.1.2.

### Paso 2 — GlobalExceptionHandler

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\controller\GlobalExceptionHandler.java`

```java
package com.NutriVida.bd.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleConflict(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Conflicto de integridad de datos"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst().orElse("Datos inválidos");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", msg));
    }
}
```

### Paso 3 — Lanzar excepción en update/delete de los tres services

Archivos:
- `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\service\ClienteService.java`
- `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\service\ProfesionalService.java`
- `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\service\ServicioService.java`

Patrón a seguir en cada uno (ejemplo con `ClienteService`):

```java
// update — verificar existencia antes de guardar
public Cliente update(Long id, Cliente cliente) {
    if (!clienteRepository.existsById(id)) {
        throw new NoSuchElementException("Cliente no encontrado con id: " + id);
    }
    cliente.setId_cliente(id);
    return clienteRepository.save(cliente);
}

// deleteById — verificar existencia antes de eliminar
public void deleteById(Long id) {
    if (!clienteRepository.existsById(id)) {
        throw new NoSuchElementException("Cliente no encontrado con id: " + id);
    }
    clienteRepository.deleteById(id);
}
```

Mismo patrón con `Profesional` (campo `id_profesional`) y `Servicio` (campo `id_servicio`).

**Verificación FEAT-001:**
```
cd C:\Users\urrut\OneDrive\Desktop\bd
.\mvnw.cmd test -pl . -Dtest=ClienteServiceTest,ProfesionalServiceTest,ServicioServiceTest
```
Todos los tests existentes deben seguir pasando (usan Mockito, no tocan BD real).

---

## FEAT-002 — Persistencia de usuarios en MySQL + registro vía backend

### Paso 1 — Migración V4__usuarios.sql

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\resources\db\migration\V4__usuarios.sql`

```sql
CREATE TABLE IF NOT EXISTS usuario (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol         VARCHAR(20)  NOT NULL DEFAULT 'USER',
    CONSTRAINT uq_usuario_username UNIQUE (username),
    CONSTRAINT uq_usuario_email    UNIQUE (email)
);

-- Hash BCrypt de 'admin123' (costo 10)
INSERT INTO usuario (username, email, password_hash, rol) VALUES
('admin', 'admin@nutrivida.cl',
 '$2a$10$7Tq8b1pBCR5xdM9z2kL3NeQxAyR4vP0wFsT6uU1mGcHdJiKoN2sXW',
 'ADMIN');

-- Hash BCrypt de 'user123' (costo 10)
INSERT INTO usuario (username, email, password_hash, rol) VALUES
('user', 'user@nutrivida.cl',
 '$2a$10$3sY7qW2rF9cN0bK4mH8tOuRvP1xT5aE6gL2iD3jN4mX7hC0eB9kAq',
 'USER');
```

> Los hashes BCrypt deben ser generados en el Paso 3 (UsuarioService) con
> `BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();` y
> `encoder.encode("admin123")`. El implementador debe reemplazar los valores
> del INSERT por los hashes reales que genere con un snippet Java o una
> herramienta BCrypt online, ya que el hash es distinto cada vez. Ver nota al pie.

**NOTA IMPORTANTE para el implementador:** Los hashes BCrypt mostrados arriba son
ejemplos de formato; deben ser reemplazados por hashes generados con:
```java
new BCryptPasswordEncoder().encode("admin123")  // para admin
new BCryptPasswordEncoder().encode("user123")   // para user
```
Una forma simple: agregar temporalmente un `@SpringBootTest` que imprima los hashes,
o usar el snippet en un `main` de prueba, o usar https://bcrypt-generator.com (costo 10).

### Paso 2 — Entidad Usuario

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\model\Usuario.java`

```java
package com.NutriVida.bd.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "usuario",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String rol;
}
```

### Paso 3 — UsuarioRepository

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\repository\UsuarioRepository.java`

```java
package com.NutriVida.bd.repository;

import com.NutriVida.bd.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

### Paso 4 — UsuarioService

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\service\UsuarioService.java`

```java
package com.NutriVida.bd.service;

import com.NutriVida.bd.model.Usuario;
import com.NutriVida.bd.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /** Registra un nuevo usuario con rol USER por defecto.
     *  Lanza IllegalArgumentException si username o email ya existen. */
    public Usuario registrar(String username, String email, String password) {
        if (usuarioRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        Usuario u = new Usuario();
        u.setUsername(username);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setRol("USER");
        return usuarioRepository.save(u);
    }

    public java.util.Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
}
```

### Paso 5 — Reescribir UserDetailsServiceImpl

Archivo: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\security\UserDetailsServiceImpl.java`

Reemplazar completamente por:

```java
package com.NutriVida.bd.security;

import com.NutriVida.bd.model.Usuario;
import com.NutriVida.bd.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        return User.withUsername(usuario.getUsername())
                .password(usuario.getPasswordHash())
                .roles(usuario.getRol())
                .build();
    }
}
```

> El `PasswordEncoder` bean ya existe en `SecurityConfig`. Spring Security lo usará
> automáticamente al comparar durante la autenticación.

### Paso 6 — RegistroRequest DTO

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\dto\RegistroRequest.java`

```java
package com.NutriVida.bd.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private String username;
    private String email;
    private String password;
}
```

### Paso 7 — POST /auth/registro en AuthController

Archivo: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\controller\AuthController.java`

Agregar import de `UsuarioService` y `RegistroRequest`, y el nuevo endpoint:

```java
@Autowired
private UsuarioService usuarioService;

@PostMapping("/registro")
@ResponseStatus(HttpStatus.CREATED)
@Operation(summary = "Registro", description = "Registra un nuevo usuario con rol USER")
public ResponseEntity<Map<String, String>> registro(@RequestBody RegistroRequest request) {
    try {
        usuarioService.registrar(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Usuario registrado exitosamente"));
    } catch (IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }
}
```

Imports adicionales a agregar a `AuthController.java`:
```java
import com.NutriVida.bd.dto.RegistroRequest;
import com.NutriVida.bd.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
```

**Verificación FEAT-002:**
```
cd C:\Users\urrut\OneDrive\Desktop\bd
.\mvnw.cmd compile
```
Debe terminar con `BUILD SUCCESS`. (Los tests de integración requieren BD levantada;
el compile es suficiente para verificar que el código compila correctamente.)

---

## FEAT-003 — Órdenes: migración, backend y frontend

### Paso 1 — Migración V5__ordenes.sql

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\resources\db\migration\V5__ordenes.sql`

```sql
CREATE TABLE IF NOT EXISTS orden (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL,
    fecha    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total    DOUBLE       NOT NULL
);

CREATE TABLE IF NOT EXISTS orden_detalle (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_orden         BIGINT  NOT NULL,
    id_servicio      BIGINT  NOT NULL,
    cantidad         INT     NOT NULL,
    precio_unitario  DOUBLE  NOT NULL,
    CONSTRAINT fk_detalle_orden    FOREIGN KEY (id_orden)    REFERENCES orden(id),
    CONSTRAINT fk_detalle_servicio FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio)
);
```

### Paso 2 — Entidades Orden y OrdenDetalle

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\model\Orden.java`

```java
package com.NutriVida.bd.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "orden")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Double total;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrdenDetalle> detalles;
}
```

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\model\OrdenDetalle.java`

```java
package com.NutriVida.bd.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "orden_detalle")
public class OrdenDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_orden", nullable = false)
    @JsonIgnore
    private Orden orden;

    @Column(name = "id_servicio", nullable = false)
    private Long idServicio;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private Double precioUnitario;
}
```

### Paso 3 — OrdenRepository

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\repository\OrdenRepository.java`

```java
package com.NutriVida.bd.repository;

import com.NutriVida.bd.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByUsername(String username);
}
```

### Paso 4 — DTOs de Orden

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\dto\OrdenItemRequest.java`

```java
package com.NutriVida.bd.dto;

import lombok.Data;

@Data
public class OrdenItemRequest {
    private Long idServicio;
    private Integer cantidad;
    private Double precioUnitario;
}
```

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\dto\OrdenRequest.java`

```java
package com.NutriVida.bd.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrdenRequest {
    private List<OrdenItemRequest> items;
}
```

### Paso 5 — OrdenService

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\service\OrdenService.java`

```java
package com.NutriVida.bd.service;

import com.NutriVida.bd.dto.OrdenItemRequest;
import com.NutriVida.bd.dto.OrdenRequest;
import com.NutriVida.bd.model.Orden;
import com.NutriVida.bd.model.OrdenDetalle;
import com.NutriVida.bd.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    public Orden crearOrden(String username, OrdenRequest request) {
        Orden orden = new Orden();
        orden.setUsername(username);
        orden.setFecha(LocalDateTime.now());

        double total = request.getItems().stream()
                .mapToDouble(i -> i.getCantidad() * i.getPrecioUnitario())
                .sum();
        orden.setTotal(total);

        List<OrdenDetalle> detalles = new ArrayList<>();
        for (OrdenItemRequest item : request.getItems()) {
            OrdenDetalle d = new OrdenDetalle();
            d.setOrden(orden);
            d.setIdServicio(item.getIdServicio());
            d.setCantidad(item.getCantidad());
            d.setPrecioUnitario(item.getPrecioUnitario());
            detalles.add(d);
        }
        orden.setDetalles(detalles);
        return ordenRepository.save(orden);
    }

    public List<Orden> findByUsername(String username) {
        return ordenRepository.findByUsername(username);
    }
}
```

### Paso 6 — OrdenController

Crear: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\controller\OrdenController.java`

```java
package com.NutriVida.bd.controller;

import com.NutriVida.bd.dto.OrdenRequest;
import com.NutriVida.bd.model.Orden;
import com.NutriVida.bd.service.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ordenes")
@Tag(name = "Órdenes", description = "Gestión de órdenes de compra")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @PostMapping
    @Operation(summary = "Crear orden", description = "Crea una nueva orden. Requiere rol USER o ADMIN.")
    public ResponseEntity<Orden> crearOrden(@RequestBody OrdenRequest request,
                                            Authentication authentication) {
        String username = authentication.getName();
        Orden orden = ordenService.crearOrden(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orden);
    }

    @GetMapping("/mias")
    @Operation(summary = "Mis órdenes", description = "Devuelve las órdenes del usuario autenticado.")
    public List<Orden> misOrdenes(Authentication authentication) {
        return ordenService.findByUsername(authentication.getName());
    }
}
```

### Paso 7 — Ajustar SecurityConfig para permitir POST /ordenes a USER y ADMIN

Archivo: `C:\Users\urrut\OneDrive\Desktop\bd\src\main\java\com\NutriVida\bd\security\SecurityConfig.java`

Agregar la regla para órdenes antes de `.anyRequest().hasRole("ADMIN")`:

```java
.requestMatchers("/ordenes/**").hasAnyRole("USER", "ADMIN")
```

La cadena de autorización queda:
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(
        "/auth/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/api-docs/**",
        "/v3/api-docs/**"
    ).permitAll()
    .requestMatchers(HttpMethod.GET, "/servicios/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/clientes/**", "/profesionales/**").hasAnyRole("USER", "ADMIN")
    .requestMatchers("/ordenes/**").hasAnyRole("USER", "ADMIN")
    .anyRequest().hasRole("ADMIN")
)
```

**Verificación FEAT-003 (backend):**
```
cd C:\Users\urrut\OneDrive\Desktop\bd
.\mvnw.cmd compile
```
`BUILD SUCCESS`.

### Paso 8 — Frontend: src/services/api.js (instancia Axios centralizada)

Crear: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react\src\services\api.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export default api;
```

### Paso 9 — Actualizar los services existentes para usar api.js

Archivos a modificar:
- `src/services/ClienteService.js`
- `src/services/ProfesionalService.js`
- `src/services/ServicioService.js`
- `src/services/AuthService.js`

Patrón: reemplazar `import axios from 'axios'` por `import api from './api'`, eliminar
la constante `BASE_URL` local, y cambiar `axios.get(...)` por `api.get(...)` usando la
ruta relativa (sin el host). Ejemplo con `ClienteService.js`:

```js
import api from './api';
import authHeader from './authHeader';

class ClienteService {
  getAllClientes() {
    return api.get('/clientes', authHeader());
  }
  getClienteById(id) {
    return api.get(`/clientes/${id}`, authHeader());
  }
  createCliente(cliente) {
    return api.post('/clientes', cliente, authHeader());
  }
  updateCliente(id, cliente) {
    return api.put(`/clientes/${id}`, cliente, authHeader());
  }
  deleteCliente(id) {
    return api.delete(`/clientes/${id}`, authHeader());
  }
}
export default new ClienteService();
```

`AuthService.js` queda:
```js
import api from './api';

class AuthService {
  login(username, password) {
    return api.post('/auth/login', { username, password }).then((r) => r.data);
  }
  registro(data) {
    return api.post('/auth/registro', data).then((r) => r.data);
  }
}
export default new AuthService();
```

### Paso 10 — src/services/OrdenService.js

Crear: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react\src\services\OrdenService.js`

```js
import api from './api';
import authHeader from './authHeader';

class OrdenService {
  crearOrden(items) {
    return api.post('/ordenes', { items }, authHeader()).then((r) => r.data);
  }
  misOrdenes() {
    return api.get('/ordenes/mias', authHeader()).then((r) => r.data);
  }
}

export default new OrdenService();
```

### Paso 11 — Actualizar AuthContext.jsx

Archivo: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react\src\context\AuthContext.jsx`

Cambios:
1. `registrarUsuario` pasa a ser `async`: llama a `AuthService.registro({username, email, password})`.
   - Si tiene éxito (201): inicia sesión automáticamente llamando a `AuthService.login` y guarda la sesión en `localStorage`.
   - Si falla con 409: retorna `{exito: false, mensaje: '...'}`.
2. `iniciarSesion`: eliminar el bloque `catch` que busca en `localStorage['nutrivida_usuarios']`.
   Si el backend falla, devolver el error directamente.

```jsx
import { createContext, useContext, useState } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('nutrivida_sesion');
    const sesion = guardado ? JSON.parse(guardado) : null;
    if (sesion && sesion.esAdmin && !sesion.token) return null;
    return sesion;
  });

  const registrarUsuario = async (datos) => {
    try {
      await AuthService.registro({
        username: datos.email,   // username = email para compatibilidad con el form
        email: datos.email,
        password: datos.password,
      });
      // Registro exitoso → iniciar sesión automáticamente
      const loginData = await AuthService.login(datos.email, datos.password);
      const sesion = {
        username: loginData.username,
        email: loginData.username,
        nombre: datos.nombre,
        apellido: datos.apellido,
        rut: datos.rut,
        fechaNacimiento: datos.fechaNacimiento,
        objetivo: datos.objetivo,
        rol: loginData.rol,
        esAdmin: loginData.rol === 'ADMIN',
        token: loginData.token,
      };
      localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
      setUsuario(sesion);
      return { exito: true };
    } catch (error) {
      if (error.response?.status === 409) {
        return { exito: false, mensaje: 'Ese correo ya está registrado, inicia sesión.' };
      }
      return { exito: false, mensaje: 'No se pudo conectar con el servidor. ¿Está encendido el backend?' };
    }
  };

  const iniciarSesion = (username, password) => {
    return AuthService.login(username, password).then((datos) => {
      const sesion = {
        username: datos.username,
        email: datos.username,
        rol: datos.rol,
        esAdmin: datos.rol === 'ADMIN',
        token: datos.token,
      };
      localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
      setUsuario(sesion);
      return { exito: true, esAdmin: sesion.esAdmin };
    }).catch((error) => {
      if (!error.response) {
        return { exito: false, mensaje: 'No se pudo conectar con el servidor. ¿Está encendido el backend?' };
      }
      return { exito: false, mensaje: 'Usuario o contraseña incorrectos' };
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('nutrivida_sesion');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Paso 12 — Actualizar Registro.jsx para manejar registrarUsuario async

Archivo: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react\src\views\Registro.jsx`

La función `handleSubmit` ya es síncrona y llama a `registrarUsuario(...)` esperando
un resultado síncrono. Debe pasar a `async/await`:

```jsx
const handleSubmit = async (event) => {
  event.preventDefault();
  // ... todas las validaciones se mantienen igual ...

  const resultado = await registrarUsuario({
    nombre, apellido, rut, email,
    password: pass,
    fechaNacimiento: fenac,
    objetivo,
  });

  if (!resultado.exito) {
    alert(resultado.mensaje);
    return;
  }

  alert('Registro exitoso!');
  navigate('/perfil');
};
```

> El `alert('Registro exitoso!')` se mantiene para no romper `Registro.test.jsx`.
> El test existente mockea el comportamiento local; después del cambio el test
> seguirá pasando porque `registrarUsuario` devuelve `{exito: true}` en su rama
> de éxito (la llamada al backend fallará en jsdom, que no tiene backend, pero el
> test mockea `AuthService` implícitamente vía AuthContext — ver nota).
>
> **NOTA sobre Registro.test.jsx:** El último test ("Debe registrar correctamente")
> actualmente pasa porque `registrarUsuario` es síncrona. Con el cambio a async,
> el test usará `AuthService.registro` que hará una petición real HTTP (que fallará
> en jsdom). Se necesita mockear `AuthService` en el test. Agregar al inicio del
> archivo de test:
> ```js
> import { vi } from 'vitest';
> import AuthService from '../services/AuthService';
> vi.spyOn(AuthService, 'registro').mockResolvedValue({});
> vi.spyOn(AuthService, 'login').mockResolvedValue({
>   username: 'juan@gmail.com', rol: 'USER', token: 'fake-token'
> });
> ```
> Y cambiar el último `it` a `async` usando `await waitFor(...)`:
> ```js
> import { render, screen, fireEvent, waitFor } from '@testing-library/react';
> // ...
> it('Debe registrar correctamente cuando todos los datos son válidos', async () => {
>   // ... mismas acciones del formulario ...
>   await waitFor(() => {
>     expect(ultimoMensaje).toBe('Registro exitoso!');
>   });
> });
> ```

### Paso 13 — Actualizar Carrito.jsx para llamar a OrdenService

Archivo: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react\src\views\Carrito.jsx`

Reemplazar `handleFinalizar`:

```jsx
import OrdenService from '../services/OrdenService';

// ...

const handleFinalizar = async () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  const items = carrito.map((item) => ({
    idServicio: item.id,
    cantidad: item.cantidad,
    precioUnitario: item.precio,
  }));
  try {
    await OrdenService.crearOrden(items);
    alert('¡Compra realizada con éxito!');
    vaciarCarrito();
  } catch {
    alert('No se pudo procesar la compra. Intenta de nuevo.');
  }
};
```

### Paso 14 — Agregar sección "Mis Órdenes" en MiPerfil.jsx

Archivo: `C:\Users\urrut\OneDrive\Desktop\nutriVida-react\src\views\MiPerfil.jsx`

Agregar import y estado:
```jsx
import { useState, useEffect } from 'react';
import OrdenService from '../services/OrdenService';
```

Dentro del componente (rama de usuario no admin), agregar:
```jsx
const [ordenes, setOrdenes] = useState([]);

useEffect(() => {
  OrdenService.misOrdenes()
    .then(setOrdenes)
    .catch(() => setOrdenes([]));
}, []);
```

Y agregar la sección en el JSX después del bloque de favoritos:
```jsx
<div style={{ flex: 1, minWidth: '250px', maxWidth: '350px' }}>
  <h3>📋 Mis Órdenes</h3>
  {ordenes.length === 0 && <p>Aún no tienes órdenes registradas.</p>}
  <ul>
    {ordenes.map((o) => (
      <li key={o.id}>
        #{o.id} — {new Date(o.fecha).toLocaleDateString('es-CL')} —{' '}
        ${o.total.toLocaleString('es-CL')}
      </li>
    ))}
  </ul>
</div>
```

**Verificación FEAT-003 (frontend):**
```
cd C:\Users\urrut\OneDrive\Desktop\nutriVida-react
npm run build
```
Debe terminar sin errores. Luego:
```
npm test -- --run
```
Todos los tests existentes deben pasar (incluido `Registro.test.jsx` tras el mock de AuthService).

---

## Orden de implementación

| # | FEAT | Archivos creados/modificados | Dependencia |
|---|------|------------------------------|-------------|
| 1 | FEAT-001 | pom.xml, GlobalExceptionHandler.java, 3 services | Ninguna |
| 2 | FEAT-002 | V4__usuarios.sql, Usuario.java, UsuarioRepository, UsuarioService, UserDetailsServiceImpl, RegistroRequest.java, AuthController (modificado) | FEAT-001 (compile verde) |
| 3 | FEAT-003 | V5__ordenes.sql, Orden.java, OrdenDetalle.java, OrdenRepository, OrdenItemRequest, OrdenRequest, OrdenService, OrdenController, SecurityConfig (modificado), api.js, OrdenService.js, AuthContext.jsx, Registro.jsx, Carrito.jsx, MiPerfil.jsx | FEAT-002 (usuario en BD para autenticar órdenes) |

## Resumen de archivos

### Backend — Nuevos
- `src/main/resources/db/migration/V4__usuarios.sql`
- `src/main/resources/db/migration/V5__ordenes.sql`
- `src/main/java/com/NutriVida/bd/model/Usuario.java`
- `src/main/java/com/NutriVida/bd/model/Orden.java`
- `src/main/java/com/NutriVida/bd/model/OrdenDetalle.java`
- `src/main/java/com/NutriVida/bd/repository/UsuarioRepository.java`
- `src/main/java/com/NutriVida/bd/repository/OrdenRepository.java`
- `src/main/java/com/NutriVida/bd/service/UsuarioService.java`
- `src/main/java/com/NutriVida/bd/service/OrdenService.java`
- `src/main/java/com/NutriVida/bd/controller/GlobalExceptionHandler.java`
- `src/main/java/com/NutriVida/bd/controller/OrdenController.java`
- `src/main/java/com/NutriVida/bd/dto/RegistroRequest.java`
- `src/main/java/com/NutriVida/bd/dto/OrdenItemRequest.java`
- `src/main/java/com/NutriVida/bd/dto/OrdenRequest.java`

### Backend — Modificados
- `pom.xml` — springdoc 2.8.8 → 3.2.0
- `src/main/java/com/NutriVida/bd/security/UserDetailsServiceImpl.java` — reescrito
- `src/main/java/com/NutriVida/bd/controller/AuthController.java` — agrega POST /registro
- `src/main/java/com/NutriVida/bd/security/SecurityConfig.java` — agrega regla /ordenes/**
- `src/main/java/com/NutriVida/bd/service/ClienteService.java` — update/delete con chequeo
- `src/main/java/com/NutriVida/bd/service/ProfesionalService.java` — update/delete con chequeo
- `src/main/java/com/NutriVida/bd/service/ServicioService.java` — update/delete con chequeo

### Frontend — Nuevos
- `src/services/api.js`
- `src/services/OrdenService.js`

### Frontend — Modificados
- `src/services/AuthService.js` — agrega método `registro()`; usa `api.js`
- `src/services/ClienteService.js` — usa `api.js`
- `src/services/ProfesionalService.js` — usa `api.js`
- `src/services/ServicioService.js` — usa `api.js`
- `src/context/AuthContext.jsx` — `registrarUsuario` async hacia backend; elimina fallback local
- `src/views/Registro.jsx` — `handleSubmit` async con `await registrarUsuario`
- `src/views/Carrito.jsx` — `handleFinalizar` llama a `OrdenService.crearOrden`
- `src/views/MiPerfil.jsx` — sección "Mis Órdenes"
- `src/views/Registro.test.jsx` — mock de AuthService para tests async
