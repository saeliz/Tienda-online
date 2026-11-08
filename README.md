# 🛒 Tienda Online

Sistema de comercio electrónico Full Stack desarrollado con una arquitectura separada de frontend y backend, orientado a la gestión y comercialización de productos en línea.

## 📌 Descripción del proyecto

Tienda Online es una aplicación web que permite gestionar la experiencia de compra mediante un catálogo de productos, carrito de compras y proceso de checkout.

El proyecto está organizado mediante una arquitectura modular, facilitando el mantenimiento, escalabilidad y evolución del sistema.

## 🏗️ Arquitectura del sistema

El proyecto está dividido en tres componentes principales:

- **Frontend:** interfaz de usuario desarrollada con React, TypeScript y Vite.
- **Backend:** API y lógica del servidor desarrolladas con NestJS.
- **Infraestructura:** contenedores y configuración de servicios mediante Docker y Docker Compose.

## 🛠️ Tecnologías utilizadas

| Área | Tecnologías |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | NestJS, Node.js |
| Infraestructura | Docker, Docker Compose |
| Control de versiones | Git, GitHub |

## 📂 Estructura del proyecto

```text
Tienda_Online/
├── backend/
│   ├── src/
│   ├── test/
│   ├── uploads/
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/saeliz/tienda-online.git
```

### 2. Acceder al proyecto

```bash
cd tienda-online
```

### 3. Configurar variables de entorno

Configurar las variables necesarias para frontend y backend utilizando los archivos `.env.example` correspondientes.

### 4. Ejecutar con Docker

```bash
docker compose up --build -d
```

### 5. Detener los servicios

```bash
docker compose down
```

## 📖 Documentación técnica

Para conocer los detalles de implementación, consulta:

- [Documentación del Backend](./backend/README.md)
- [Documentación del Frontend](./frontend/README.md)

## 👨‍💻 Autor

**Saeliz**

Desarrollo de Software | Full Stack Development

## 📄 Licencia

Todos los derechos reservados.