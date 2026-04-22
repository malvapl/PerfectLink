# PerfectLink
Proyecto FP Desarrollo de Aplicaciones Web - 2024

*DISCLAIMER*
Este proyecto fue desarrollado en el transcurso de 2-3 meses (compaginado con un horario de jornada completa en prácticas).
No pretende ser una web funcional, simplemente demostrar los conocimientos adquiridos en el curso.
*DISCLAIMER*

## Descripción
PerfectLink es una aplicación web para planificación de bodas con un backend API en Laravel y un frontend en React TypeScript.

## Tecnologías
- **Backend**: Laravel (API REST)
- **Frontend**: React TypeScript con Vite
- **Base de Datos**: MySQL
- **Estilos**: Material-UI, Bootstrap

## Instalación y Configuración

### Prerrequisitos
- PHP 8.1 o superior
- Composer
- Node.js 16+ y npm
- MySQL/MariaDB
- Servidor web (Apache/Nginx) con mod_rewrite habilitado (ej. XAMPP)

### Paso 1: Clonar el Proyecto
Se debe colocar en la carpeta htdocs/ de xampp
```
cd xampp/htdocs
git clone https://github.com/tu-repo/PerfectLink.git
cd PerfectLink
```

### Paso 2: Configurar el Backend (Laravel)
1. Instalar dependencias PHP:
   ```
   cd project-back
   composer install
   ```

2. Configurar el entorno:
   - Copiar configuración: `cp .env.example .env`
   - Editar `.env`:
     ```
     APP_NAME=PerfectLink
     APP_ENV=local
     APP_KEY=
     APP_DEBUG=true
     APP_URL=http://localhost/PerfectLink/public

     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=perfectlink_db
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   - Crear la base de datos en MySQL.

3. Generar clave de aplicación:
   ```
   php artisan key:generate
   ```

4. Ejecutar migraciones y seeders:
   ```
   php artisan migrate --seed
   ```

5. Servir el backend:
   - Con XAMPP: acceder en `http://localhost/PerfectLink/public`.
   - Alternativa: `php artisan serve` (ajustar URLs).

### Paso 3: Configurar el Frontend (React)
1. Instalar dependencias JS:
   ```
   cd project-front
   npm install
   ```

2. Configurar entorno:
   - Crear `.env`
   - Si se usó xampp para servir el backend:
     ```
     VITE_HOST=http://localhost/PerfectLink/public/api/
     ```
   - Si se usó artisan serve:
     ```
     VITE_HOST=http://127.0.0.1:8000/api/
     ```
3. Iniciar servidor de desarrollo:
   ```
   npm run dev
   ```
   - Acceder en `http://localhost:5173`.

### Acceso a la Aplicación
- **Frontend**: `http://localhost:5173`
- **API Backend**: `http://localhost/PerfectLink/public/api/` ó `http://127.0.0.1:8000/api/`

### Datos de Prueba
Después de ejecutar `php artisan migrate --seed`, se crean usuarios y datos de ejemplo. Credenciales para iniciar sesión:

- **Organizador 1**:
  - Email: `organizer@educastur.es`
  - Contraseña: `Organizer1`

- **Organizador 2**:
  - Email: `organizer2@educastur.es`
  - Contraseña: `Organizer2`

- **Administrador**:
  - Email: `admin@educastur.es`
  - Contraseña: `Admin007`

- **Usuario de Prueba**:
  - Email: `prueba@mail.com`
  - Contraseña: `asdasdasdA`

También se crean 100 invitados aleatorios, bodas de ejemplo, mesas, información adicional, buses y eventos previos a la boda.

## Solución de Problemas
- Reiniciar `npm run dev` después de cambios en `.env`.
- Verificar consola del navegador para errores de API/CORS.
- Asegurar que mod_rewrite esté habilitado en Apache.
