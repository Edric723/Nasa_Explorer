## Diagrama de arquitectura

![Diagrama de arquitectura de Nasa Explorer](src/assets/img/backgrounds/diagram.png)


# ¿Cómo funciona NASA Explorer?

Esta aplicación Ionic/Angular proporciona acceso autenticado a paneles temáticos de la NASA. Los usuarios inician sesión y luego pueden explorar:

- Imagen Astronómica del Día (APOD).
- Objetos cercanos a la Tierra (NEO).
- Eventos naturales (EONET).

La vista de eventos incluye filtrado por categoría, un mapa y cálculos de distancia aproximada mediante la ubicación IP.

La autenticación admite registro, confirmación de cuenta y recuperación de contraseña.

El proyecto también conserva las páginas de integrantes y acerca de (dentro del botón de menú), y el simulador de NEO.

Algunas implementaciones de servicios y módulos de interfaz de usuario no se extrajeron. Por eso, sus enlaces de datos externos solo se muestran cuando son directamente compatibles o están identificados como no verificados.

## Componentes

### 1. Navegación de la aplicación

- Rutas de la aplicación: `src/app/app-routing.module.ts`
- Pestañas del panel de control: `src/app/tabs/tabs.page.ts`
- Menú global: `src/app/components/menu-global/menu-global.component.ts`
- Página Acerca de: `src/app/pages/4.Menu/about/about.page.ts`
- Página Léame: `src/app/pages/4.Menu/readme/readme.page.ts`

### 2. Identidad y acceso

- Inicio de sesión y registro: `src/app/pages/0-Login/login.page.ts`
- Servicio de autenticación: `src/app/services/auth.service.ts`
- Guardias de ruta: `src/app/auth/auth-guard.ts`
- Almacenamiento de sesión: `src/app/services/auth.service.ts`

### 3. Paneles de astronomía

**APOD**
- Panel de control: `src/app/pages/1-Apod/apod.page.ts`
- Servicio: `src/app/services/apod.service.ts`
- Modelo de datos: `src/app/models/apod.model.ts`

**NEO**
- Panel de control: `src/app/pages/2-Neo/neo.page.ts`
- Servicio: `src/app/services/neo.service.ts`
- Modelo de datos: `src/app/models/neo.model.ts`
- Simulador NEO: `src/app/components/simulador-neo/simulador-neo.component.ts`

**Configuración de API**
- `src/environments/environment.ts`

### 4. Eventos naturales

- Panel de eventos: `src/app/pages/3-Eonet/eonet.page.ts`
- Servicio EONET: `src/app/services/eonet.service.ts`
- Modelo de eventos: `src/app/models/event-eonet.model.ts`
- Categorías de eventos: `src/app/models/categoria-eonet.model.ts`
- Geolocalización IP: `src/app/services/geolocation.service.ts`

### 5. Otros componentes y servicios externos

- Usuario de la aplicación.
- Amazon Cognito.
- Proveedor de ubicación IP.
- Mosaicos de OpenStreetMap.

## Conexiones entre componentes

1. El usuario accede a las rutas de la aplicación.
2. Las rutas permiten acceder al inicio de sesión y al registro.
3. Después de la autenticación se cargan las pestañas del panel de control.
4. Las guardias de ruta verifican la sesión mediante el servicio de autenticación.
5. El servicio de autenticación se comunica con Amazon Cognito y conserva los tokens de sesión.
6. Las pestañas del panel de control permiten acceder a APOD, NEO y eventos naturales.
7. APOD utiliza su servicio y modelo de datos para solicitar y presentar información.
8. NEO utiliza su servicio, modelo de datos y simulador.
9. Los servicios APOD y NEO consultan la configuración de API.
10. El panel de eventos utiliza el servicio EONET, los modelos de datos y las categorías para mostrar y filtrar eventos.
11. La geolocalización IP obtiene información de ubicación para los cálculos de distancia.
12. El mapa utiliza mosaicos de OpenStreetMap.
13. El menú global permite abrir las páginas Acerca de e integrantes.
