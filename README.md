<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

# 🏥 Gestión Clínica - Backend

Backend API desarrollada en [NestJS](https://nestjs.com) para la gestión de una clínica médica. Permite la administración de usuarios, citas médicas, sedes, historias clínicas, roles y reportes.

---

## 🧰 Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones Node.js escalables.
- **TypeORM**: ORM para interactuar con bases de datos.
- **MySQL**: Base de datos relacional.
- **Swagger**: Documentación automática de API.
- **JWT**: Autenticación segura.
- **Class Validator**: Validaciones de entrada.
- **TypeScript**: Tipado estático y desarrollo robusto.

---

## 📦 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/bjcGit/red-medical-back.git
   cd red-medical-back
   ```

2. Instala las dependencias:

   ```bash
   yarn install
   ```

3. Instala el CLI de NestJS (si aún no lo tienes):

   ```bash
   npm install -g @nestjs/cli
   ```

4. Asegúrate de tener un servidor MySQL ejecutándose (versión recomendada: 8.x).

---

## ⚙️ Configuración

Copia el archivo `.env.example` a `.env` y personaliza las variables de entorno según tu entorno local:

```bash
cp .env.example .env
```

Variables comunes:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=
DATABASE_NAME=medical
JWT_SECRET=supersecreto
PORT=3000
```

---

## 🧪 Ejecución del Proyecto

Levanta el servidor de desarrollo:

```bash
yarn start:dev
```

---

## 🗃️ Arquitectura de Carpetas

```bash
src/
│
├── auth/                # Autenticación, JWT, estrategias
├── usuarios/            # Módulo de usuarios (pacientes, profesionales, admins)
├── citas/               # Gestión de citas médicas
├── historias-clinicas/  # Módulo para historias clínicas
├── sedes/               # Módulo de sedes clínicas
├── dashboard/           # Estadísticas y métricas del sistema
├── common/              # Pipes, guards, interceptors, decorators
└── main.ts              # Punto de entrada
```

---

## 📄 Documentación de la API

Disponible automáticamente en Swagger una vez iniciado el servidor:

```
http://localhost:3000/api
```

---

## 📈 Funcionalidades Principales

- Registro y autenticación de usuarios.
- Gestión de roles: paciente, profesional, administrativo.
- CRUD de sedes clínicas.
- Asignación de citas con validaciones (disponibilidad, duplicados).
- Gestión de historias clínicas.
- Actualización automática de estado de citas vencidas.
- Panel de estadísticas y métricas (total de pacientes, profesionales, citas por estado, etc).
- Logs y manejo de errores.

---

## ✅ Validaciones Incluidas

- Un paciente no puede agendar dos citas a la misma hora.
- Un profesional no puede tener dos citas simultáneas.
- Una historia clínica no puede duplicarse por paciente.
- Solo usuarios con roles correctos pueden ejecutar acciones específicas.

---

## 🚀 Comandos Útiles

- Compilar en producción:

  ```bash
  yarn build
  ```

- Levantar en modo producción:

  ```bash
  yarn start:prod
  ```

- Ver errores de eslint:

  ```bash
  yarn lint
  ```

---

## 🧠 Contribuir

1. Crea un fork del repositorio.
2. Crea una rama con tu feature: `git checkout -b mi-feature`
3. Haz commit de tus cambios: `git commit -m 'Agrega mi feature'`
4. Push a la rama: `git push origin mi-feature`
5. Abre un Pull Request.

---

## 📜 Licencia

MIT License © 2025 [Futurama]