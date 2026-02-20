# 🖼️ Kushki Analyzer — AI-Powered Image Tagging

**Kushki** es una aplicación web full-stack diseñada para analizar imágenes y generar etiquetas descriptivas automáticamente utilizando la API de inteligencia artificial de [Imagga](https://imagga.com).

## 🏗️ Decisiones de Arquitectura

Este proyecto prioriza la mantenibilidad, escalabilidad y una experiencia de desarrollo moderna.

### Backend — Arquitectura Hexagonal (Ports & Adapters)
Hemos implementado una **Arquitectura Hexagonal** en el backend para:
- **Desacoplamiento**: La lógica de negocio (`Domain Core`) es totalmente independiente del framework web (Flask) y del proveedor de IA (Imagga).
- **Flexibilidad**: Podemos cambiar el proveedor de IA o el framework web simplemente creando un nuevo adapter, sin tocar la lógica central.
- **Testabilidad**: Permite realizar pruebas unitarias del dominio sin dependencias externas mediante el uso de "Mocks" o "Fakes" en los puertos.

### Frontend — Clean Architecture
En el frontend, seguimos los principios de **Clean Architecture**:
- **Separación de Capas**: Presentación (React), Aplicación (Hooks/Use Cases), Dominio (Modelos puros) e Infraestructura (API).
- **Independencia del UI**: La lógica de análisis de imágenes no depende de cómo se visualiza, facilitando cambios en el diseño sin romper la funcionalidad.

### Stack Tecnológico Moderno (2025)
- **Tailwind CSS v4**: Migración a la versión más reciente que utiliza una configuración "CSS-first", eliminando la necesidad de archivos de configuración JS complejos y mejorando el rendimiento de compilación.
- **uv + poethepoet**: Sustituimos `pip` por `uv` para una gestión de paquetes extremadamente rápida. Integramos `poethepoet` como task runner para unificar comandos (tests, lint, dev) bajo un mismo ecosistema.
- **Docker + Vite Preview**: En lugar de configurar un servidor Nginx separado para producción, utilizamos el servidor de `preview` de Vite. Esto simplifica el despliegue manteniendo un entorno fiel al build final.

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Rol |
|-------|------------|-------------|
| **Backend** | Python Flask | API REST & Orquestación |
| **Frontend** | React 19 + Vite | Interfaz de Usuario Reactiva |
| **Estilos** | Tailwind CSS v4 | Diseño moderno y responsive |
| **AI Service** | Imagga API | Motor de análisis de imágenes |
| **Gestor de Tareas** | poethepoet | Automatización de flujos (Dev/Test) |
| **Paquetes** | uv (Python) | Instalación y gestión de entorno |

## 🚀 Inicio Rápido

### Requisitos Previos
- Python 3.12+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) instalado globalmente.
- Cuenta en [Imagga](https://imagga.com) (Credenciales API).

### 1. Clonar y Configurar

```bash
git clone <repo-url>
cd kushki
```

### 2. Backend (Servidor)

```bash
cd server
cp .env.example .env # Configura tus credenciales de Imagga aquí
uv sync
uv run poe dev
```
El servidor estará disponible en `http://localhost:5000`.

### 3. Frontend (Cliente)

```bash
cd client
npm install
npm run dev
```
La aplicación se abrirá en `http://localhost:5173`.

## 🐳 Docker (Entorno Completo)

Hemos optimizado el `docker-compose.yml` para levantar todo el stack con un solo comando, incluyendo la configuración de red y variables de entorno.

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:4173` (Vite Preview)
- **Backend**: `http://localhost:5000`

## 🧪 Pruebas y Calidad

Utilizamos un sistema unificado de tareas:

| Tarea | Comando (Backend) | Comando (Frontend) |
|-------|-------------------|--------------------|
| **Desarrollo** | `uv run poe dev` | `npm run dev` |
| **Pruebas** | `uv run poe test` | `npm test` |
| **Lint/Auditoría** | `uv run poe check` | `n/a` |

## 🔌 Referencia de la API

### `POST /api/analyze`
Sube una imagen para obtener etiquetas descriptivas.

**Cuerpo (form-data):**
- `image`: Archivo (JPEG/PNG, máx 5MB).

**Respuesta Exitosa (200 OK):**
```json
{
  "tags": [
    { "label": "paisaje", "confidence": 99.2 },
    { "label": "montaña", "confidence": 85.5 }
  ]
}
```

## 📂 Estructura del Proyecto

```
kushki/
├── client/                # React + Vite (Clean Architecture)
│   ├── src/
│   │   ├── presentation/  # Componentes UI (React)
│   │   ├── application/   # Logica de aplicacion (Hooks)
│   │   ├── domain/        # Reglas de negocio y modelos
│   │   └── infrastructure/# Adaptadores de API
├── server/                # Flask (Hexagonal Architecture)
│   ├── app/
│   │   ├── domain/        # Entidades y Puertos
│   │   ├── application/   # Casos de Uso
│   │   └── adapters/      # Implementaciones (HTTP, Imagga)
└── docker-compose.yml     # Orquestación de contenedores
```

---
Diseñado con ❤️ para la eficiencia y escalabilidad.
