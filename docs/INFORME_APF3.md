# INFORME DE AVANCE DEL PROYECTO INTEGRADOR

## AVANCE 3 — SEMANA 15

| Dato | Información |
|---|---|
| Curso | Desarrollo Web Integrado |
| Código del curso | 100000ST61 |
| Docente | [Apellidos y nombres] |
| Sección / turno | [Completar] |
| Nombre del proyecto | TechStore — Sistema de Venta de Productos Tecnológicos |
| Integrantes del equipo | [Apellido 1, Nombre 1] · [Apellido 2, Nombre 2] · [Apellido 3, Nombre 3] · [Apellido 4, Nombre 4] |
| Fecha de presentación | [dd/mm/aaaa] |
| Repositorio del proyecto | [URL de GitHub u otro repositorio] |

---

## 1. RESUMEN EJECUTIVO

TechStore es una aplicación web full stack orientada a la venta de productos tecnológicos (laptops, celulares, periféricos, audio y componentes). El problema que resuelve es la ausencia de un canal digital centralizado para que una tienda de tecnología publique su catálogo, reciba pedidos y controle su inventario, tareas que en la actualidad suelen realizarse de forma manual y dispersa. La solución implementada integra una SPA desarrollada en Angular 21 con una API REST construida en Spring Boot 4.1.1 sobre PostgreSQL, autenticada mediante JWT y con dos roles: ADMIN y CLIENTE.

El cliente puede registrarse, iniciar sesión, explorar el catálogo con filtros y paginación, revisar el detalle de un producto, agregarlo a un carrito persistente, confirmar un pedido y cancelarlo mientras esté pendiente. El administrador dispone de un panel con indicadores, gestión de productos, categorías, pedidos y usuarios, además de reportes de ventas, productos más vendidos y stock bajo. En este avance se consolidó la integración frontend–backend: los formularios reactivos consumen los servicios REST, el interceptor adjunta el token Bearer, los guards protegen las rutas y las respuestas y errores se reflejan en la interfaz. El backend expone 46 endpoints y cuenta con 13 pruebas automatizadas que se ejecutan correctamente. Queda pendiente conectar en la SPA los módulos de banners, inventario y edición de configuración, que ya existen en la API, así como el despliegue final.

*(Extensión: aproximadamente 220 palabras.)*

---

## 2. DESCRIPCIÓN DEL PROYECTO Y ALCANCE

### 2.1 Problema y objetivo

Una tienda de productos tecnológicos necesita ofrecer su catálogo en línea, recibir pedidos de clientes y administrar de forma segura su inventario y sus ventas. Sin un sistema integrado, la información se duplica en hojas de cálculo, no existe trazabilidad del stock y el cliente no puede consultar la disponibilidad ni el estado de sus pedidos.

**Objetivo general:** desarrollar una aplicación web full stack que integre un frontend Angular con una API REST Spring Boot y una base de datos PostgreSQL, permitiendo la venta en línea de productos tecnológicos con autenticación por roles, control de stock y reportes administrativos.

**Objetivos específicos:**

1. Implementar autenticación y autorización con JWT y BCrypt para los roles ADMIN y CLIENTE.
2. Desarrollar un catálogo paginado con filtros por nombre, categoría y rango de precios.
3. Permitir la creación y cancelación de pedidos con validación y descuento/restauración de stock.
4. Construir un panel administrativo para productos, categorías, pedidos, usuarios y reportes.
5. Integrar el frontend Angular con la API mediante servicios HTTP, interceptores y guards.
6. Verificar el flujo completo con pruebas unitarias y de integración.

### 2.2 Funcionalidades consideradas

| N.º | Módulo / funcionalidad | Descripción | Estado |
|---:|---|---|---|
| 1 | Autenticación y registro | Registro público de clientes, login con JWT, cierre de sesión y control de token expirado. | Completo |
| 2 | Catálogo de productos | Listado paginado con filtros por nombre, categoría, precio mínimo y máximo; avisos de stock bajo y agotado. | Completo |
| 3 | Detalle de producto | Consulta de descripción, precio, stock, categoría y marca; agregado al carrito. | Completo |
| 4 | Carrito y checkout | Carrito persistente en `localStorage`, control de cantidades según stock y creación del pedido. | Completo |
| 5 | Mis pedidos | Historial del cliente con detalle, total y cancelación de pedidos PENDIENTES. | Completo |
| 6 | Panel administrativo | Dashboard con KPIs, accesos rápidos y navegación protegida por rol. | Completo |
| 7 | CRUD de productos y categorías | Alta, edición, activación lógica y eliminación controlada; categorías jerárquicas. | Completo |
| 8 | Gestión de pedidos | Filtros por estado, usuario y fechas; cambio de estado y restauración de stock al cancelar. | Completo |
| 9 | Gestión de usuarios | Listado paginado, alta, edición, activación/desactivación, cambio de rol y eliminación. | Completo |
| 10 | Reportes | Resumen de ventas, top de productos, ventas por categoría y productos con stock bajo. | Completo |
| 11 | Banners de la tienda | CRUD y consulta pública de banners en la API. | Parcial: backend completo, sin interfaz en la SPA |
| 12 | Configuración de la tienda | Consulta pública usada por el footer; actualización disponible solo por API. | Parcial: lectura en frontend, edición solo backend |
| 13 | Inventario y movimientos | Registro automático/manual de ENTRADA, SALIDA y AJUSTE, con historial paginado. | Parcial: backend completo, sin interfaz en la SPA |
| 14 | Interfaz responsive y tema | Diseño adaptable, menú móvil, sidebar colapsable y tema claro/oscuro persistente. | Completo |

### 2.3 Cambios respecto al Avance 2

En esta versión se consolidó la integración funcional entre Angular y Spring Boot y se amplió el alcance del backend:

- Se incorporó el consumo real de la API desde todos los módulos del frontend mediante servicios tipados y `HttpClient`.
- Se implementó el `authInterceptor`, que adjunta el token `Bearer` y limpia la sesión ante un `401`.
- Se aplicaron guards funcionales (`authGuard`, `adminGuard`, `guestGuard`) a las rutas protegidas.
- Se completaron los formularios reactivos de login, registro, productos, categorías y usuarios con validaciones y mensajes inline.
- Se añadieron los módulos administrativos de dashboard, pedidos, usuarios, reportes e inventario (este último en backend).
- Se agregaron entidades y servicios de banners, configuración e inventario, además del árbol de categorías y la paginación de usuarios.
- Se incorporaron mejoras de UI/UX: tema claro/oscuro, footer dinámico desde la API, gráficos sin librerías externas, avisos de stock y diseño responsive.
- Se corrigió la configuración de pruebas de `PedidoServiceTest` (faltaba el mock de `InventarioService`), logrando que la suite completa de 13 tests finalice en verde.

> **Observaciones del APF2 atendidas:** [Completar con las observaciones concretas recibidas y la acción realizada. Si no hubo observaciones, indicar: “No se recibieron observaciones formales; se priorizó la integración frontend–backend.”]

**Justificación de cambios de alcance:** la incorporación de inventario, banners y configuración responde a la necesidad de que el administrador controle el stock y la identidad de la tienda; en esta entrega se priorizó su implementación en la API y se dejó la interfaz correspondiente para el avance final.

---

## 3. ARQUITECTURA Y TECNOLOGÍAS

### 3.1 Diagrama de arquitectura

```text
┌──────────────────────────────┐
│ Usuario / Navegador          │
│ (desktop y móvil)            │
└──────────────┬───────────────┘
               │ HTTP/HTTPS
               ▼
┌──────────────────────────────────────────────┐
│ SPA Angular 21.2 (standalone, signals)       │
│ Componentes · Rutas lazy · Reactive Forms    │
│ Guards (auth/admin/guest) · Interceptor JWT  │
│ environment.apiUrl → http://localhost:8080/api│
└──────────────┬───────────────────────────────┘
               │ JSON + Authorization: Bearer <JWT>
               ▼
┌──────────────────────────────────────────────┐
│ API REST — Spring Boot 4.1.1 (Java 21)       │
│ Spring Security 7 + JwtAuthenticationFilter  │
│ Controller → Service → Repository            │
│ DTOs (records) · GlobalExceptionHandler      │
└──────────────┬───────────────────────────────┘
               │ Spring Data JPA / Hibernate 7.4.5
               ▼
┌──────────────────────────────────────────────┐
│ PostgreSQL 17 (local)                         │
│ usuarios · categorias · productos · pedidos   │
│ detalles_pedido · banners · configuracion     │
│ movimientos_inventario                        │
└──────────────────────────────────────────────┘
```

> **Figura 1.** Diagrama de arquitectura del sistema. *(Insertar el diagrama elaborado en draw.io o similar, o una captura de este esquema.)*

**Comunicación entre componentes:**

- El navegador carga la SPA Angular; cada acción del usuario se resuelve en un componente que invoca un servicio Angular.
- El servicio realiza una petición HTTP a `environment.apiUrl` (`/api`), adjuntando el JWT mediante el interceptor.
- Spring Security valida el token, autoriza según la ruta y deriva la petición al controlador REST.
- El controlador delega la lógica al servicio, que aplica reglas de negocio y accede a los repositorios JPA.
- La respuesta se transforma en DTO (nunca se serializan entidades) y se devuelve como JSON.
- Angular actualiza sus señales y la vista; los errores se muestran al usuario con el mensaje uniforme del backend.

### 3.2 Tecnologías y herramientas utilizadas

| Componente | Tecnología / versión | Uso en el proyecto |
|---|---|---|
| Frontend | Angular 21.2.25 · TypeScript 5.9.3 · SASS | Componentes standalone, rutas lazy, signals, formularios reactivos, estilos responsive y tema claro/oscuro. |
| Backend | Java 21 · Spring Boot 4.1.1 | API REST en capas, inyección por constructor, transacciones y reglas de negocio. |
| Persistencia | Spring Data JPA / Hibernate 7.4.5 · PostgreSQL 17.6 (driver 42.7.13) | Entidades, consultas JPQL y derived queries, esquema con `ddl-auto=update`. |
| Seguridad | Spring Security 7.1.1 · JWT (JJWT 0.12.6) · BCrypt | Autenticación stateless, autorización por rol, hash de contraseñas. |
| Documentación API | springdoc OpenAPI 3.1.1 | Swagger UI en `/swagger-ui.html`. |
| Pruebas | JUnit 5 · Mockito · MockMvc · H2 2.4.240 | 13 pruebas unitarias y de integración con perfil `h2`. |
| Pruebas manuales | Postman / Hoppscotch · Swagger UI | Validación de endpoints, códigos HTTP y flujos completos. |
| Control de versiones | Git · GitHub | Repositorio y commits del equipo. |
| Despliegue | Docker · Render/Railway · Vercel/Netlify | Planificado para el avance final; configuración base ya incluida. |

---

## 4. BACKEND: SERVICIOS REST IMPLEMENTADOS

El backend sigue una arquitectura por capas dentro del paquete `com.sistematecnologico`:

```text
controller/   → Auth, Productos, Categorías, Pedidos, Usuarios, Banners,
                Configuración y controladores Admin (pedidos, usuarios,
                reportes, inventario, banners)
service/      → 9 servicios con reglas de negocio y @Transactional
repository/   → 8 repositorios Spring Data JPA (JPQL + derived queries)
entity/       → 8 entidades JPA + enums Rol, EstadoPedido, TipoMovimiento
dto/          → 28 records de request/response
security/     → JwtService, JwtAuthenticationFilter, entry point 401, handler 403
config/       → SecurityConfig (CORS), OpenApiConfig, DataInitializer
exception/    → GlobalExceptionHandler + excepciones de negocio
```

> **Figura 2.** Estructura de paquetes y clases principales del backend en el IDE. *(Insertar captura del árbol de paquetes.)*

### 4.1 Endpoints REST

**Autenticación**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 1 | `/api/auth/registro` | POST | Público | Registro de cliente; devuelve JWT y datos del usuario (201). | Completo |
| 2 | `/api/auth/login` | POST | Público | Valida credenciales y devuelve JWT (200). | Completo |

**Productos**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 3 | `/api/productos` | GET | Público | Catálogo paginado con filtros `nombre`, `categoriaId`, `minPrecio`, `maxPrecio`, `soloActivos`. | Completo |
| 4 | `/api/productos/{id}` | GET | Público | Detalle de producto (200/404). | Completo |
| 5 | `/api/productos` | POST | ADMIN | Crea producto (201). | Completo |
| 6 | `/api/productos/{id}` | PUT | ADMIN | Actualiza producto (200). | Completo |
| 7 | `/api/productos/{id}` | DELETE | ADMIN | Elimina o desactiva lógicamente si tiene historial (204). | Completo |

**Categorías**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 8 | `/api/categorias` | GET | Público | Lista categorías ordenadas por nombre. | Completo |
| 9 | `/api/categorias/arbol` | GET | Público | Devuelve categorías raíz con subcategorías anidadas. | Completo |
| 10 | `/api/categorias/{id}` | GET | Público | Obtiene una categoría (200/404). | Completo |
| 11 | `/api/categorias` | POST | ADMIN | Crea categoría, opcionalmente con `padreId` (201). | Completo |
| 12 | `/api/categorias/{id}` | PUT | ADMIN | Actualiza categoría y jerarquía (200). | Completo |
| 13 | `/api/categorias/{id}` | DELETE | ADMIN | Elimina si no tiene productos ni subcategorías (204/400). | Completo |

**Pedidos**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 14 | `/api/pedidos` | POST | CLIENTE/ADMIN | Crea pedido, valida stock, descuenta inventario y calcula el total en backend (201). | Completo |
| 15 | `/api/pedidos/mis-pedidos` | GET | CLIENTE/ADMIN | Historial del usuario autenticado. | Completo |
| 16 | `/api/pedidos/{id}` | GET | Propio/ADMIN | Detalle del pedido (200/403/404). | Completo |
| 17 | `/api/pedidos/{id}/cancelar` | PATCH | Propio/ADMIN | Cancela solo si está PENDIENTE y restaura stock (200/400). | Completo |

**Usuarios (CRUD administrativo)**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 18 | `/api/usuarios` | GET | ADMIN | Lista todos los usuarios. | Completo |
| 19 | `/api/usuarios/paginado` | GET | ADMIN | Lista usuarios paginados. | Completo |
| 20 | `/api/usuarios/{id}` | GET | ADMIN | Obtiene usuario (200/404). | Completo |
| 21 | `/api/usuarios` | POST | ADMIN | Crea usuario (201). | Completo |
| 22 | `/api/usuarios/{id}` | PUT | ADMIN | Actualiza nombre, apellido y email (200). | Completo |
| 23 | `/api/usuarios/{id}` | DELETE | ADMIN | Elimina usuario (204). | Completo |

**Administración de usuarios**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 24 | `/api/admin/usuarios` | GET | ADMIN | Usuarios paginados. | Completo |
| 25 | `/api/admin/usuarios/{id}` | GET | ADMIN | Obtiene usuario. | Completo |
| 26 | `/api/admin/usuarios` | POST | ADMIN | Crea usuario con rol ADMIN o CLIENTE (201). | Completo |
| 27 | `/api/admin/usuarios/{id}` | PUT | ADMIN | Actualiza datos básicos. | Completo |
| 28 | `/api/admin/usuarios/{id}/activo` | PATCH | ADMIN | Activa o desactiva usuario. | Completo |
| 29 | `/api/admin/usuarios/{id}/rol` | PATCH | ADMIN | Cambia el rol del usuario. | Completo |
| 30 | `/api/admin/usuarios/{id}` | DELETE | ADMIN | Elimina usuario (204). | Completo |

**Administración de pedidos**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 31 | `/api/admin/pedidos` | GET | ADMIN | Todos los pedidos con filtros por estado, usuario y fechas (paginado). | Completo |
| 32 | `/api/admin/pedidos/{id}/estado` | PATCH | ADMIN | Cambia el estado a PENDIENTE, PAGADO o CANCELADO. | Completo |

**Reportes**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 33 | `/api/admin/reportes/resumen` | GET | ADMIN | KPIs de ventas, pedidos por estado, usuarios y productos. | Completo |
| 34 | `/api/admin/reportes/top-productos` | GET | ADMIN | Productos más vendidos (`limite`, por defecto 5). | Completo |
| 35 | `/api/admin/reportes/ventas-por-categoria` | GET | ADMIN | Ventas agrupadas por categoría. | Completo |
| 36 | `/api/admin/reportes/stock-bajo` | GET | ADMIN | Productos con stock menor o igual a `umbral`. | Completo |

**Banners**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 37 | `/api/banners` | GET | Público | Banners activos ordenados. | Completo (sin UI) |
| 38 | `/api/admin/banners` | GET | ADMIN | Todos los banners, incluidos inactivos. | Completo (sin UI) |
| 39 | `/api/admin/banners` | POST | ADMIN | Crea banner (201). | Completo (sin UI) |
| 40 | `/api/admin/banners/{id}` | PUT | ADMIN | Actualiza banner. | Completo (sin UI) |
| 41 | `/api/admin/banners/{id}` | DELETE | ADMIN | Elimina banner (204). | Completo (sin UI) |

**Configuración de la tienda**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 42 | `/api/configuracion` | GET | Público | Datos de la tienda; consumido por el footer. | Completo |
| 43 | `/api/configuracion` | PUT | ADMIN | Actualiza la configuración. | Completo (sin UI) |

**Inventario**

| N.º | Recurso / endpoint | Método | Acceso | Descripción | Estado |
|---:|---|---|---|---|---|
| 44 | `/api/admin/inventario/movimientos` | GET | ADMIN | Historial paginado de movimientos. | Completo (sin UI) |
| 45 | `/api/admin/inventario/productos/{productoId}/movimientos` | GET | ADMIN | Movimientos de un producto. | Completo (sin UI) |
| 46 | `/api/admin/inventario/movimientos` | POST | ADMIN | Registra ENTRADA, SALIDA o AJUSTE (201). | Completo (sin UI) |

**Endpoints técnicos:** `GET /v3/api-docs`, `GET /swagger-ui.html` y `GET /actuator/health` son públicos.

**Códigos de estado utilizados:** `200 OK`, `201 Created`, `204 No Content`, `400` (validación o regla de negocio), `401` (no autenticado), `403` (sin permisos), `404` (no encontrado) y `409` (email o nombre duplicado).

### 4.2 Evidencias del backend

> **Figura 3.** Swagger UI con los controladores documentados (`http://localhost:8080/swagger-ui.html`). *(Insertar captura.)*

> **Figura 4.** Login mediante Postman: `POST /api/auth/login` con respuesta `200` y token JWT. *(Insertar captura de solicitud y respuesta.)*

> **Figura 5.** Consulta paginada del catálogo: `GET /api/productos?page=0&size=12` con respuesta `200`. *(Insertar captura.)*

> **Figura 6.** Creación de producto por ADMIN: `POST /api/productos` con respuesta `201`. *(Insertar captura.)*

> **Figura 7.** Seguridad: `401` al llamar un endpoint protegido sin token y `403` al intentar crear un producto con rol CLIENTE. *(Insertar ambas capturas.)*

> **Figura 8.** Validación y conflicto: `400` con errores por campo y `409` al registrar un email duplicado. *(Insertar capturas.)*

> **Figura 9.** Ejecución de pruebas: `./mvnw test` con **13 tests, 0 failures, 0 errors** y `BUILD SUCCESS`. *(Insertar captura de la terminal.)*

> **Figura 10.** Base de datos PostgreSQL: tablas `usuarios`, `productos`, `pedidos`, `detalles_pedido`, `categorias`, `banners`, `configuracion` y `movimientos_inventario`. *(Insertar captura de pgAdmin.)*

---

## 5. FRONTEND: APLICACIÓN ANGULAR

### 5.1 Estructura y componentes

La SPA fue desarrollada con **Angular 21 standalone**, sin `NgModule`, con **lazy loading por componente** (`loadComponent`), **signals** para el estado y **Reactive Forms** para los formularios. La organización es:

```text
src/app/
├── core/
│   ├── guards/        auth.guard.ts · admin.guard.ts · guest.guard.ts
│   ├── interceptors/  auth.interceptor.ts
│   ├── models/        models.ts (interfaces y tipos)
│   ├── services/      auth · producto · categoria · pedido · carrito ·
│   │                  admin · configuracion · tema
│   └── utils/         graficos.ts
├── shared/components/ navbar · footer · not-found
└── features/
    ├── home/          home.component.ts
    ├── catalogo/      catalogo.component.ts · detalle/detalle.component.ts
    ├── auth/          login/ · registro/
    ├── carrito/       carrito.component.ts
    ├── pedidos/       mis-pedidos.component.ts
    └── admin/         admin-layout · dashboard · categorias · productos ·
                       pedidos · usuarios · reportes
```

**Rutas principales (`app.routes.ts`):**

| Ruta | Componente | Carga | Guard |
|---|---|---|---|
| `/` | HomeComponent | Lazy | — |
| `/catalogo` | CatalogoComponent | Lazy | — |
| `/catalogo/:id` | DetalleComponent | Lazy | — |
| `/login` | LoginComponent | Lazy | `guestGuard` |
| `/registro` | RegistroComponent | Lazy | `guestGuard` |
| `/carrito` | CarritoComponent | Lazy | — (exige sesión al confirmar) |
| `/mis-pedidos` | MisPedidosComponent | Lazy | `authGuard` |
| `/admin` | AdminLayoutComponent | Lazy | `adminGuard` |
| `/admin` (hijo) | DashboardComponent | Lazy | hereda `adminGuard` |
| `/admin/categorias` | CategoriasComponent | Lazy | hereda `adminGuard` |
| `/admin/productos` | ProductosComponent | Lazy | hereda `adminGuard` |
| `/admin/pedidos` | PedidosComponent | Lazy | hereda `adminGuard` |
| `/admin/usuarios` | UsuariosComponent | Lazy | hereda `adminGuard` |
| `/admin/reportes` | ReportesComponent | Lazy | hereda `adminGuard` |
| `**` | NotFoundComponent | Lazy | — |

**Lógica de los guards:**

- `authGuard`: permite el acceso solo si existe usuario y token JWT no expirado; en caso contrario redirige a `/login`.
- `adminGuard`: exige sesión y rol ADMIN; un cliente autenticado es redirigido a `/`.
- `guestGuard`: impide que un usuario autenticado vuelva a login/registro; lo redirige a `/admin` o `/` según su rol.

### 5.2 Vistas y navegación

El usuario navega desde la barra superior (navbar), que se adapta al rol:

- **Visitante:** Inicio, Catálogo, Login y Registro.
- **Cliente autenticado:** Inicio, Catálogo, Mis pedidos, Carrito y cierre de sesión.
- **Administrador:** Inicio, Catálogo, Panel admin y cierre de sesión; el panel usa un sidebar con Dashboard, Productos, Categorías, Pedidos, Usuarios y Reportes.

Flujo principal del cliente: `Home → Catálogo → Detalle → Carrito → Login (si no tiene sesión) → Pedido confirmado → Mis pedidos`.

Flujo del administrador: `Login → /admin (Dashboard) → Productos / Categorías / Pedidos / Usuarios / Reportes`.

> **Figura 11.** Página de inicio con hero y accesos al catálogo y al registro. *(Insertar captura.)*

> **Figura 12.** Catálogo con filtros por nombre, categoría y precios, tarjetas de producto y paginación. *(Insertar captura.)*

> **Figura 13.** Detalle de producto con precio, stock y acciones de carrito. *(Insertar captura.)*

> **Figura 14.** Carrito con cantidades, subtotales, total y botón “Realizar pedido”. *(Insertar captura.)*

> **Figura 15.** Confirmación de pedido con número generado y carrito vaciado. *(Insertar captura.)*

> **Figura 16.** Mis pedidos: historial, estado y cancelación de un pedido PENDIENTE. *(Insertar captura.)*

> **Figura 17.** Dashboard administrativo con KPIs, top de productos y gráficos de ventas. *(Insertar captura.)*

> **Figura 18.** Administración de productos: tabla paginada y formulario de creación/edición. *(Insertar captura.)*

> **Figura 19.** Administración de categorías, incluida la selección de categoría padre. *(Insertar captura.)*

> **Figura 20.** Administración de pedidos con filtros y cambio de estado. *(Insertar captura.)*

> **Figura 21.** Administración de usuarios con rol, estado activo y acciones. *(Insertar captura.)*

> **Figura 22.** Reportes: resumen, ventas por categoría, top de productos y stock bajo. *(Insertar captura.)*

> **Figura 23.** Diseño responsive (menú móvil) y tema oscuro. *(Insertar captura de la SPA en vista móvil y con tema oscuro.)*

> **Figura 24.** Página 404 para rutas no existentes. *(Insertar captura.)*

### 5.3 Formularios y validaciones

Todos los formularios son **reactivos** (`ReactiveFormsModule` + `FormBuilder`) y muestran mensajes inline cuando el control está inválido y ha sido tocado.

| Formulario | Campos principales | Validaciones implementadas | Evidencia |
|---|---|---|---|
| Login | email, password | `required`; `email` en el correo. | Figura 25 |
| Registro | nombre, apellido, email, password, confirmar | `required`; `email`; `minLength(8)` en password; validador de grupo que exige coincidencia. | Figura 26 |
| Categoría (admin) | nombre, descripción, padre | `required` en nombre. | Figura 19 |
| Producto (admin) | nombre, categoría, precio, stock, activo | `required` en nombre y categoría; `min(0.01)` en precio; `min(0)` en stock. | Figura 18 |
| Usuario (admin) | nombre, apellido, email, password, rol | `required` en nombre, apellido y email; `email`. | Figura 21 |
| Filtros de catálogo | nombre, categoría, precio mín./máx. | Atributos numéricos `min="0"`; sin validación de rango entre mínimo y máximo. | Figura 12 |
| Filtros de pedidos (admin) | estado, usuario, desde, hasta | Tipos `select`, `number` y `date`; sin validación de rango de fechas. | Figura 20 |

> **Figura 25.** Login con mensajes de validación inline (`email` inválido y contraseña obligatoria). *(Insertar captura.)*

> **Figura 26.** Registro con validaciones de campos obligatorios, formato de correo, longitud mínima y confirmación de contraseña. *(Insertar captura.)*

**Observación de mejora:** el formulario de creación de usuarios no aplica `minLength` a la contraseña (solo el backend la valida), y el formulario de productos no expone `marca` ni `imagenUrl` aunque el modelo los admite. Se registran como acciones de mejora en la sección 9.

### 5.4 Manejo de errores y mensajes

- **Validación del cliente:** cada control inválido y tocado muestra un mensaje inline con la clase `.form-error`; el borde del campo se resalta con `.ng-invalid.ng-touched`.
- **Errores del servidor:** los componentes capturan `err.error?.mensaje` y lo muestran con `.mensaje-error`; si no existe, usan un mensaje de respaldo (por ejemplo, “Credenciales incorrectas.” o “No se pudo realizar el pedido.”).
- **Sesión expirada:** el `authInterceptor` detecta `401` cuando había token, elimina `techstore_token` y `techstore_usuario`, limpia el estado del usuario y redirige a `/login`.
- **Permisos:** un `403` se muestra como mensaje de error devuelto por el backend; los guards evitan además el acceso a rutas no permitidas.
- **Mensajes de éxito:** se muestran inline, por ejemplo “¡Pedido realizado con éxito! N.º {id}” en el carrito y “Usuario guardado correctamente.” en administración.
- **Estados de carga:** señales `cargando`, `guardando`, `enviando`, `cancelando` deshabilitan botones y muestran spinners o textos como “Ingresando…”, “Guardando…” o “Confirmando…”.
- **Confirmaciones destructivas:** cancelar pedido y eliminar producto, categoría o usuario solicitan confirmación con el diálogo nativo `confirm()`.

**Limitación identificada:** el frontend muestra el mensaje general del backend, pero no distribuye el mapa `errores` por campo que devuelve Bean Validation. Se propone mapearlo en el componente para resaltar cada campo.

---

## 6. INTEGRACIÓN ANGULAR – SPRING BOOT

### 6.1 URL base de la API

La URL se define en los archivos de entorno y se selecciona en tiempo de compilación:

| Archivo | `production` | `apiUrl` |
|---|---:|---|
| `src/environments/environment.ts` | `false` | `http://localhost:8080/api` |
| `src/environments/environment.prod.ts` | `true` | `https://techstore-backend.onrender.com/api` |

`angular.json` aplica `fileReplacements` al compilar en producción, de modo que todos los servicios usan `environment.apiUrl` sin cambios de código.

### 6.2 Servicios Angular y endpoints consumidos

| Servicio | Métodos principales | Endpoints consumidos |
|---|---|---|
| `AuthService` | `login`, `registro`, `logout`, `isLogueado`, `esAdmin` | `POST /auth/login`, `POST /auth/registro` |
| `ProductoService` | `listar`, `obtener`, `crear`, `actualizar`, `eliminar` | `/productos` (GET, POST, PUT, DELETE) |
| `CategoriaService` | `listar`, `crear`, `actualizar`, `eliminar` | `/categorias` (GET, POST, PUT, DELETE) |
| `PedidoService` | `crear`, `misPedidos`, `cancelar` | `/pedidos`, `/pedidos/mis-pedidos`, `/pedidos/{id}/cancelar` |
| `AdminService` | `listarPedidos`, `cambiarEstado`, `listarUsuarios`, `crearUsuario`, `actualizarUsuario`, `cambiarActivo`, `cambiarRol`, `eliminarUsuario`, `resumen`, `topProductos`, `ventasPorCategoria`, `stockBajo` | `/admin/pedidos`, `/admin/usuarios`, `/admin/reportes/*` |
| `ConfiguracionService` | `obtener` | `GET /configuracion` (footer) |
| `CarritoService` | `agregar`, `cambiarCantidad`, `quitar`, `vaciar` | Sin HTTP; persiste en `localStorage` |
| `TemaService` | `alternar`, `aplicar` | Sin HTTP; persiste en `localStorage` |

### 6.3 Flujo completo de una operación

**Ejemplo de consulta: catálogo con filtros**

1. El usuario ingresa a `/catalogo` y completa los filtros (nombre, categoría, precio mínimo/máximo).
2. `CatalogoComponent` construye los parámetros y llama a `ProductoService.listar({ page, size, nombre, categoriaId, minPrecio, maxPrecio })`.
3. El servicio ejecuta `GET /api/productos` con `HttpParams`.
4. El `authInterceptor` adjunta `Authorization: Bearer <token>` si hay sesión.
5. `SecurityConfig` permite la ruta como pública; `ProductoController` recibe los filtros y `ProductoService` ejecuta la consulta JPQL paginada.
6. El backend devuelve `PageResponse<ProductoResponse>` con `contenido`, `pagina`, `tamano`, `totalElementos`, `totalPaginas` y `ultima`.
7. El componente actualiza sus señales (`productos`, `totalPaginas`, `pagina`) y la vista se re-renderiza; si falla, apaga el estado de carga y muestra el mensaje correspondiente.

**Ejemplo de registro: crear un pedido**

1. El cliente agrega productos al carrito y pulsa “Realizar pedido” en `/carrito`.
2. `CarritoComponent.comprar()` verifica la sesión; si no existe, redirige a `/login`.
3. `PedidoService.crear(items)` ejecuta `POST /api/pedidos` con `{ items: [{ productoId, cantidad }] }`.
4. `JwtAuthenticationFilter` valida el token y `SecurityConfig` exige rol CLIENTE o ADMIN.
5. `PedidoController` delega en `PedidoService.crear()`, método `@Transactional` que: agrupa cantidades repetidas, verifica producto activo y stock, descuenta stock, congela el precio unitario, calcula subtotales y total, guarda el pedido en estado PENDIENTE y registra un movimiento de inventario tipo SALIDA.
6. El backend responde `201 Created` con `PedidoResponse`.
7. El componente vacía el carrito, muestra “¡Pedido realizado con éxito! N.º {id}” y el usuario puede revisar el pedido en `/mis-pedidos`.

> **Figura 27.** Consumo de `GET /api/productos` desde la SPA: petición y respuesta visibles en la pestaña Network de DevTools. *(Insertar captura.)*

> **Figura 28.** Consumo de `POST /api/pedidos`: cuerpo de la solicitud, cabecera `Authorization: Bearer` y respuesta `201`. *(Insertar captura.)*

> **Figura 29.** Fragmento del servicio Angular y del interceptor que adjunta el token. *(Insertar captura de código.)*

### 6.4 Problemas de integración y soluciones

| Problema | Solución aplicada |
|---|---|
| El frontend recibía `401` en rutas protegidas. | Se implementó `authInterceptor` para adjuntar el token y limpiar la sesión cuando expira. |
| Rutas administrativas accesibles sin sesión. | Se aplicaron `authGuard`, `adminGuard` y `guestGuard` a las rutas correspondientes. |
| CORS bloqueaba las peticiones desde `localhost:4200`. | `SecurityConfig` configura CORS global con el origen permitido (`CORS_ORIGINS`). |
| Los errores del backend no se mostraban al usuario. | Se estandarizó `ErrorResponse` y los componentes muestran `err.error?.mensaje` con respaldo local. |
| Tras iniciar sesión desde el carrito no se volvía al carrito. | Limitación detectada: el login ignora el parámetro `redirect`; se registra como mejora en la sección 9. |
| El frontend no podía editar la configuración ni ver banners/inventario. | Se documenta como alcance parcial: la API está lista y la interfaz queda para el avance final. |

---

## 7. AUTENTICACIÓN Y AUTORIZACIÓN

### 7.1 Funcionamiento

1. **Registro:** `POST /api/auth/registro` valida los datos, verifica que el email no exista (`409` si está duplicado), codifica la contraseña con **BCrypt**, asigna siempre el rol CLIENTE y devuelve un JWT.
2. **Login:** `POST /api/auth/login` busca al usuario por email, compara la contraseña con BCrypt y rechaza con `401` si las credenciales son incorrectas o el usuario está inactivo.
3. **Token JWT:** se genera con `JwtService`; incluye `sub` (email), claim `uid` (ID), claim `rol` (ADMIN/CLIENTE), fecha de emisión y expiración (24 horas por defecto). La firma es HMAC-SHA con la clave configurada en `app.jwt.secret`.
4. **Almacenamiento en el cliente:** el frontend guarda el token en `localStorage` bajo `techstore_token` y los datos del usuario en `techstore_usuario`. `AuthService.tokenValido` decodifica el payload y verifica `exp` para considerar la sesión válida.
5. **Envío del token:** `authInterceptor` clona cada petición y agrega `Authorization: Bearer <token>`.
6. **Validación en el backend:** `JwtAuthenticationFilter` lee el header, valida la firma y la expiración, extrae `sub` y `rol`, y crea la autenticación con autoridad `ROLE_<rol>` en el `SecurityContext`.
7. **Autorización:** `SecurityConfig` define las reglas por URL; `RestAuthenticationEntryPoint` responde `401` y `RestAccessDeniedHandler` responde `403`, ambos en JSON uniforme.
8. **Protección en Angular:** los guards bloquean rutas y redirigen según el rol; el interceptor cierra la sesión ante un `401`.

**Reglas de acceso del backend:**

| Rutas | Acceso |
|---|---|
| `/api/auth/**`, Swagger, `/actuator/health`, `/actuator/info` | Público |
| `GET /api/productos/**`, `GET /api/categorias/**`, `GET /api/banners/**`, `GET /api/configuracion/**` | Público |
| `/api/admin/**`, `/api/usuarios/**` | `ROLE_ADMIN` |
| `POST/PUT/PATCH/DELETE` sobre productos, categorías, banners y configuración | `ROLE_ADMIN` |
| `/api/pedidos/**` | `ROLE_CLIENTE` o `ROLE_ADMIN` |
| Cualquier otra ruta | Autenticado |

### 7.2 Pruebas de autenticación y autorización

| Prueba | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|
| Acceso sin autenticación a `/api/admin/pedidos` | `401 Unauthorized` en JSON | `401` verificado en `AuthIntegrationTest` y en Postman | Figura 7 |
| Acceso a ruta protegida del frontend (`/admin`) sin sesión | Redirección a `/login` | Redirección correcta mediante `adminGuard` | Figura 30 |
| Inicio de sesión válido | `200` con token y redirección según rol | ADMIN → `/admin`; CLIENTE → `/` | Figuras 4 y 31 |
| Contraseña incorrecta | `401` con mensaje | Mensaje “Credenciales incorrectas.” en el formulario | Figura 25 |
| Usuario inactivo | `401` y sin token | Rechazo en `AuthService` (prueba unitaria) | — |
| CLIENTE intenta crear producto | `403 Forbidden` | `403` verificado en `AuthIntegrationTest` | Figura 7 |
| CLIENTE intenta acceder a `/admin` | Redirección a `/` | Redirección mediante `adminGuard` | Figura 30 |
| Token expirado o inválido | Limpieza de sesión y redirección a `/login` | `authInterceptor` elimina claves y redirige | Figura 32 |

> **Figura 30.** Guard de administrador: un usuario CLIENTE que intenta abrir `/admin` es redirigido al inicio. *(Insertar captura.)*

> **Figura 31.** Sesión persistida: `techstore_token` y `techstore_usuario` en `localStorage`, y redirección por rol después del login. *(Insertar captura.)*

> **Figura 32.** Token expirado o inválido: el interceptor limpia la sesión y redirige a `/login`. *(Insertar captura.)*

**Limitaciones de seguridad identificadas:** no existe refresh token, revocación ni logout en servidor; un token sigue siendo válido hasta su expiración aunque el usuario sea desactivado. Además, el algoritmo HMAC efectivo depende de la longitud de la clave (con el secreto de desarrollo de 52 bytes se usa HmacSHA384), por lo que se recomienda fijar explícitamente HS256 o HS384 y usar un secreto robusto en producción.

---

## 8. ESTADO DEL PROYECTO Y PARTICIPACIÓN DEL EQUIPO

| Integrante | Responsabilidades asignadas | Actividades realizadas en este avance | Aporte / evidencia |
|---|---|---|---|
| [Nombre 1] | Backend: seguridad, autenticación y pedidos | Implementación/verificación de JWT, BCrypt, reglas de pedidos, stock e inventario; pruebas unitarias y de integración. | Commits del backend, `AuthIntegrationTest`, `PedidoServiceTest`, Figuras 6–9 |
| [Nombre 2] | Frontend: catálogo, carrito y pedidos | Servicios HTTP, componentes de catálogo/detalle/carrito, formularios y manejo de errores; integración con la API. | Commits del frontend, Figuras 12–16 y 27–28 |
| [Nombre 3] | Frontend: panel administrativo y reportes | Dashboard, CRUD de productos/categorías/usuarios, gestión de pedidos, reportes y guards. | Commits del frontend, Figuras 17–22 y 30 |
| [Nombre 4] | Base de datos, pruebas y documentación | Modelo de datos, datos iniciales, pruebas manuales con Postman/Swagger, informe y evidencias. | Script SQL, colección Postman, Figuras 2–10 y documentación |

> Ajustar nombres, responsabilidades y evidencias según la participación real. Todos los integrantes deben poder explicar el funcionamiento del proyecto.

**Distribución sugerida si el equipo tiene menos integrantes:** consolidar las responsabilidades 1 y 4 (backend/BD/pruebas) y las 2 y 3 (frontend), manteniendo que cada integrante domine el flujo completo de al menos un módulo.

---

## 9. PROBLEMAS IDENTIFICADOS Y ACCIONES

| Problema / limitación | Impacto | Causa identificada | Solución aplicada o acción pendiente | Responsable |
|---|---|---|---|---|
| `PedidoServiceTest` fallaba con `NullPointerException` | Alto: la suite de pruebas no pasaba | Faltaba el mock de `InventarioService` tras incorporar el registro automático de movimientos | **Resuelto:** se agregó `@Mock InventarioService`; los 13 tests pasan | [Nombre 1] |
| Banners, inventario y edición de configuración sin interfaz | Medio: funcionalidades de la API no explotadas desde la SPA | Se priorizó la integración del flujo de compra y el panel principal | Pendiente: crear componentes, servicios y rutas en el avance final | [Nombre 3] |
| Errores de validación del backend no se asignan por campo | Medio: el usuario ve un solo mensaje general | `ErrorResponse` incluye `errores`, pero el frontend solo lee `mensaje` | Pendiente: mapear `err.error.errores` a los controles del formulario | [Nombre 2] |
| El login ignora el parámetro `redirect` enviado por el carrito | Bajo: el usuario debe volver manualmente al carrito | `LoginComponent` redirige siempre según el rol | Pendiente: leer y validar `redirect` antes de navegar | [Nombre 2] |
| El formulario de usuarios no valida la contraseña en el cliente | Bajo: error tardío desde el backend | El control `password` no tiene validadores | Pendiente: agregar `required` y `minLength(8)` en modo creación | [Nombre 3] |
| Sin control de concurrencia sobre el stock | Medio: dos compras simultáneas podrían sobrevender | No hay bloqueo optimista ni pesimista | Pendiente: evaluar `@Version` o bloqueo pesimista en productos | [Nombre 1] |
| JWT sin revocación ni refresh | Medio: un token sigue válido hasta 24 h | Diseño stateless sin lista negra | Pendiente/opcional: refresh token o validación de usuario activo en el filtro | [Nombre 1] |
| Actualizar stock desde el CRUD no genera movimiento de inventario | Bajo: el historial puede quedar desalineado | El cambio directo de stock no invoca `InventarioService` | Pendiente: unificar la actualización de stock con el registro de movimientos | [Nombre 1] |
| Algoritmo HMAC del JWT no fijado explícitamente | Bajo: el README indica HS256 pero la clave de 52 bytes produce HS384 | `Jwts.signWith(key)` elige el algoritmo por longitud de clave | Pendiente: fijar el algoritmo y documentar el secreto de producción | [Nombre 1] |
| Validaciones de rango incompletas en filtros | Bajo: se envían combinaciones inválidas y el backend decide | No se valida `minPrecio <= maxPrecio` ni `desde <= hasta` | Pendiente: validadores de grupo en los formularios de filtros | [Nombre 2] |
| Sin pruebas automatizadas en el frontend | Medio: regresiones no detectadas | No hay target `test` ni archivos `.spec.ts` | Pendiente/opcional: incorporar pruebas de componentes y servicios | [Nombre 2] |
| Despliegue no realizado | Medio: el avance se evalúa en local | Falta configurar credenciales y servicios cloud | Planificado para el avance final (sección 10) | [Nombre 4] |

---

## 10. PLAN DE TRABAJO PARA EL AVANCE FINAL

| Actividad pendiente | Entregable / resultado esperado | Responsable | Fecha prevista |
|---|---|---|---|
| Completar la interfaz de banners, inventario y configuración | Componentes, servicios y rutas integradas con la API | [Nombre 3] | [dd/mm/aaaa] |
| Mapear errores de validación por campo en los formularios | Mensajes específicos por campo y mejor experiencia de usuario | [Nombre 2] | [dd/mm/aaaa] |
| Corregir redirección posterior al login y validaciones de rango | Flujo de carrito→login→carrito y filtros consistentes | [Nombre 2] | [dd/mm/aaaa] |
| Reforzar reglas de stock y estado de pedidos | Control de concurrencia y transiciones válidas | [Nombre 1] | [dd/mm/aaaa] |
| Pruebas integrales y ajustes | Suite de 13 tests en verde + pruebas manuales documentadas | [Nombre 1] y [Nombre 4] | [dd/mm/aaaa] |
| Despliegue del backend y frontend | URL pública de la API y de la SPA, con variables de entorno | [Nombre 4] | [dd/mm/aaaa] |
| Preparar documentación y demostración final | Informe final, video de demostración y diapositivas | Todos | [dd/mm/aaaa] |

---

## 11. CONCLUSIONES

1. Se logró una integración funcional completa del flujo de compra: el cliente puede registrarse, autenticarse, explorar el catálogo, agregar productos al carrito, crear un pedido y cancelarlo, con validaciones tanto en Angular como en Spring Boot.
2. La arquitectura por capas del backend y el uso de DTOs mantienen separadas las responsabilidades y evitan exponer entidades JPA o contraseñas; el manejo global de excepciones devuelve respuestas JSON uniformes.
3. La seguridad basada en JWT con BCrypt, guards en Angular e interceptor HTTP protege las rutas y funcionalidades según el rol, con respuestas `401` y `403` consistentes.
4. El panel administrativo cubre la gestión de productos, categorías, pedidos, usuarios y reportes, lo que permite operar la tienda sin acceso directo a la base de datos.
5. La suite de pruebas se estabilizó en 13 pruebas exitosas, incluyendo un flujo de integración completo con H2; como trabajo futuro se prioriza la interfaz de banners/inventario/configuración, el mapeo de errores por campo y el despliegue en la nube.

---

## 12. ANEXOS Y ENLACES

- **Repositorio Git:** [URL de GitHub u otro repositorio]
- **Documentación de API (Swagger local):** `http://localhost:8080/swagger-ui.html`
- **Colección de pruebas:** `docs/postman/TechStore.postman_collection.json`
- **Script de base de datos:** `docs/sql/techstore_schema.sql`
- **Guía de despliegue:** `docs/DESPLIEGUE.md`
- **Video de demostración:** [URL, si se solicita]
- **Otras evidencias:** capturas incluidas en este informe y carpeta `docs/evidencias/` (si se habilita)

---

## LISTA DE VERIFICACIÓN ANTES DE ENTREGAR

- ☐ El informe identifica al proyecto y a todos los integrantes.
- ☐ Se explica el avance respecto al APF2.
- ☐ Se presenta el diagrama de arquitectura actualizado.
- ☐ Se documentan endpoints REST y sus métodos HTTP.
- ☐ Se muestran componentes, rutas y pantallas Angular.
- ☐ Se evidencian formularios y validaciones.
- ☐ Se demuestra consumo de API REST desde Angular.
- ☐ Se presentan pruebas con resultados observados.
- ☐ Se explica el estado de autenticación/autorización.
- ☐ Se detallan problemas, acciones pendientes y responsables.
- ☐ Se incluye el enlace al repositorio y las evidencias solicitadas.

---

## ANEXO A. GUÍA DE CAPTURAS (COMPLETAR ANTES DE ENTREGAR)

Tomar las capturas en este orden; guardarlas en `docs/evidencias/` con el nombre indicado.

| Figura | Qué capturar | Dónde | Nombre sugerido | Estado |
|---:|---|---|---|---|
| 1 | Diagrama de arquitectura | draw.io / documento | `fig01_arquitectura.png` | ☐ |
| 2 | Paquetes y clases del backend | IDE (IntelliJ/VS Code) | `fig02_paquetes_backend.png` | ☐ |
| 3 | Swagger UI con controladores | `http://localhost:8080/swagger-ui.html` | `fig03_swagger.png` | ☐ |
| 4 | Login `200` con token | Postman/Hoppscotch | `fig04_login.png` | ☐ |
| 5 | `GET /api/productos` paginado | Postman/Swagger | `fig05_get_productos.png` | ☐ |
| 6 | `POST /api/productos` `201` | Postman (token ADMIN) | `fig06_post_producto.png` | ☐ |
| 7 | `401` sin token y `403` con CLIENTE | Postman | `fig07_401_403.png` | ☐ |
| 8 | `400` validación y `409` duplicado | Postman | `fig08_400_409.png` | ☐ |
| 9 | `./mvnw test` con 13 tests OK | Terminal | `fig09_tests.png` | ☐ |
| 10 | Tablas de PostgreSQL | pgAdmin | `fig10_base_datos.png` | ☐ |
| 11 | Home | `http://localhost:4200` | `fig11_home.png` | ☐ |
| 12 | Catálogo con filtros y paginación | `/catalogo` | `fig12_catalogo.png` | ☐ |
| 13 | Detalle de producto | `/catalogo/{id}` | `fig13_detalle.png` | ☐ |
| 14 | Carrito | `/carrito` | `fig14_carrito.png` | ☐ |
| 15 | Pedido exitoso | `/carrito` tras confirmar | `fig15_pedido_ok.png` | ☐ |
| 16 | Mis pedidos y cancelación | `/mis-pedidos` | `fig16_mis_pedidos.png` | ☐ |
| 17 | Dashboard admin | `/admin` | `fig17_dashboard.png` | ☐ |
| 18 | Admin productos | `/admin/productos` | `fig18_admin_productos.png` | ☐ |
| 19 | Admin categorías | `/admin/categorias` | `fig19_admin_categorias.png` | ☐ |
| 20 | Admin pedidos | `/admin/pedidos` | `fig20_admin_pedidos.png` | ☐ |
| 21 | Admin usuarios | `/admin/usuarios` | `fig21_admin_usuarios.png` | ☐ |
| 22 | Admin reportes | `/admin/reportes` | `fig22_admin_reportes.png` | ☐ |
| 23 | Responsive y tema oscuro | DevTools móvil / botón de tema | `fig23_responsive_tema.png` | ☐ |
| 24 | Página 404 | ruta inexistente | `fig24_404.png` | ☐ |
| 25 | Login con validaciones inline | `/login` (enviar vacío) | `fig25_login_validacion.png` | ☐ |
| 26 | Registro con validaciones inline | `/registro` | `fig26_registro_validacion.png` | ☐ |
| 27 | Network `GET /api/productos` | DevTools → Network | `fig27_network_get.png` | ☐ |
| 28 | Network `POST /api/pedidos` con Bearer | DevTools → Network | `fig28_network_post.png` | ☐ |
| 29 | Código del interceptor/servicio | IDE | `fig29_codigo_interceptor.png` | ☐ |
| 30 | Guard admin con usuario CLIENTE | Navegador | `fig30_guard_admin.png` | ☐ |
| 31 | `localStorage` con token | DevTools → Application | `fig31_localstorage.png` | ☐ |
| 32 | `401` por token expirado | Postman / navegador | `fig32_token_expirado.png` | ☐ |

> **Consejo:** para las capturas de Postman, muestra siempre método, URL, cabeceras relevantes, cuerpo de la solicitud y código de respuesta. Para las capturas del navegador, incluye la URL visible y, cuando aplique, la pestaña Network.

---

## ANEXO B. ALINEACIÓN CON LA RÚBRICA DEL AVANCE 3

| Criterio (puntaje) | Cómo se cumple | Evidencias |
|---|---|---|
| Arquitectura Angular y componentes (4 pts) | SPA standalone organizada en `core`, `shared` y `features`, con 18 componentes, servicios tipados, signals y módulos administrativos. | Sección 5.1, Figuras 11–24 |
| Navegación y rutas (4 pts) | Rutas lazy con `loadComponent`, guards `auth`, `admin` y `guest`, redirección por rol y página 404. | Sección 5.1–5.2, Figuras 23, 30 |
| Formularios y validaciones (4 pts) | Formularios reactivos con validadores `required`, `email`, `minLength`, `min`, validador de grupo y mensajes inline. | Sección 5.3, Figuras 25–26 |
| Consumo de API REST (5 pts) | Servicios HTTP para todos los módulos, interceptor Bearer, manejo de respuestas y errores, flujo completo de consulta y registro. | Sección 6, Figuras 27–29 |
| Diseño UI/UX y responsive (3 pts) | Interfaz consistente, menú móvil, sidebar, tema claro/oscuro, avisos de stock y estados de carga. | Sección 5.2–5.4, Figuras 11–24 |

---

*Avance de Proyecto Final 3 – Semana 15 · Desarrollo Web Integrado*
