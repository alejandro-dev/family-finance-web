# Family Finance Web

Aplicación frontend de **Family Finance**, un proyecto de portfolio centrado en ayudar a familias a gestionar ingresos, gastos, miembros compartidos y proyecciones financieras desde un único panel.

Está construida con **Next.js 16**, **React 18** y **TypeScript**, usando App Router para combinar renderizado en servidor, rutas autenticadas y una interfaz pensada para la gestión financiera diaria.

## Descripción

Este frontend está planteado para demostrar tanto visión de producto como capacidad técnica:

- Flujos completos de autenticación con cookies HTTP-only
- Áreas protegidas para operaciones financieras familiares
- Dashboard con métricas, gráficas y predicciones
- Flujos CRUD para gastos, ingresos, categorías, usuarios y miembros de la familia
- Integración con una API en Spring Boot y un microservicio de predicción basado en ML

## Funcionalidades principales

- Registro, inicio de sesión, verificación de email, recuperación y cambio de contraseña
- Dashboard familiar con:
  - tarjetas resumen
  - comparativa entre ingresos y gastos
  - gráficas de gastos anuales
  - tabla de gastos recientes
  - ranking de miembros con mayor gasto
  - widgets de predicción financiera para los próximos 12 meses
- Gestión de gastos con filtros, tablas y modales de edición
- Gestión de ingresos puntuales y reglas de ingresos recurrentes
- Invitación y alta de nuevos miembros familiares
- Vistas de perfil y administración de usuarios
- Rutas internas que actúan como capa intermedia hacia el backend preservando la autenticación

## Stack tecnológico

- Next.js 16
- React 18
- TypeScript
- Tailwind CSS 4
- ESLint
- Tabler Icons

## Estructura del proyecto

```text
app/
  (auth)/               Páginas de autenticación
  (protected)/          Áreas protegidas de la aplicación
  api/                  Rutas servidor que consumen la API Spring
features/
  auth/
  dashboard/
  expenses/
  incomes/
  family-members/
  categories/
  profile/
  users/
services/               Helpers compartidos para backend y predicción
layout/                 Shell principal, header y sidebar
```

## Notas de arquitectura

El frontend no accede directamente a la base de datos ni al servicio de machine learning. Se comunica con la API Spring Boot mediante rutas del servidor y usa cookies para las peticiones autenticadas. Las predicciones que se muestran en el dashboard se solicitan al backend, que a su vez delega en el servicio FastAPI.

## Ejecución en local

### Requisitos

- Node.js 20 o superior
- pnpm
- La API backend corriendo por defecto en `http://localhost:8080/api`

### Instalar dependencias

```bash
corepack enable
pnpm install
```

### Iniciar el servidor de desarrollo

```bash
SPRING_API_URL=http://localhost:8080/api pnpm dev
```

Abrir `http://localhost:3000`.

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Docker

Este proyecto incluye una build multi-stage y además está integrado en el `docker-compose.yml` del repositorio.

Para levantar el stack completo:

```bash
docker compose up --build
```

La aplicación web quedará disponible en `http://localhost:3000`.

## Variables de entorno

La variable principal en tiempo de ejecución es:

```bash
SPRING_API_URL=http://localhost:8080/api
```

En Docker esta URL apunta al contenedor interno de la API.

## Servicios relacionados

- `family-finance-api`: API principal de negocio
- `family-finance-model-service`: microservicio de predicción
- `family-finance-ml-jobs`: pipeline batch de entrenamiento y generación de datasets
