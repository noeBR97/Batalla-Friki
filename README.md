# ⚔️ Batalla Friki

Aplicación multiplayer en tiempo real desarrollada con NestJS, MongoDB y Socket.IO que permite a los usuarios registrarse, iniciar sesión y enfrentarse en batallas por turnos con sistema de experiencia y subida de nivel.

El proyecto combina arquitectura REST con comunicación en tiempo real mediante WebSockets, integrando persistencia en base de datos y sincronización de estado entre cliente y servidor.

---

## 🧠 Descripción del proyecto

Batalla Friki es una aplicación full-stack que implementa:

- Autenticación basada en JWT
- Arquitectura modular en NestJS
- Persistencia de datos con MongoDB
- Comunicación en tiempo real con Socket.IO
- Sistema de experiencia y progresión de nivel
- Lobby de batallas activas

El objetivo es simular un sistema de combate entre dos jugadores con actualización en vivo de los turnos y del estado del combate.

---

## 🏗 Arquitectura

La aplicación está dividida en dos partes principales:

### Backend

Construido con NestJS y organizado en módulos:

- Módulo de autenticación
- Módulo de usuarios
- Módulo de personajes
- Módulo de batallas
- Gateway WebSocket para comunicación en tiempo real

El backend expone una API REST protegida mediante JWT y utiliza Socket.IO para emitir eventos en tiempo real.

### Frontend

Cliente web desarrollado en TypeScript puro que:

- Consume la API REST mediante fetch
- Se conecta al servidor mediante WebSockets
- Muestra información dinámica del combate
- Sincroniza estado tras cambios en base de datos

---

## 🔐 Sistema de autenticación

El sistema utiliza JSON Web Tokens (JWT):

1. El usuario se registra.
2. El usuario inicia sesión.
3. El servidor devuelve un token firmado.
4. El cliente incluye el token en las peticiones protegidas.
5. El backend valida el token mediante Guards.

Esto permite proteger rutas y garantizar que solo usuarios autenticados puedan crear o unirse a batallas.

---

## ⚔️ Sistema de batallas

Las batallas siguen este flujo:

1. Un usuario crea una batalla.
2. La batalla se almacena en base de datos con estado activo.
3. Otro usuario puede unirse desde el lobby.
4. Cuando hay dos jugadores conectados:
   - Se inicia el combate.
   - Se ejecuta la lógica de turnos.
   - Se emiten eventos en tiempo real.
5. Al finalizar:
   - Se determina el ganador.
   - Se actualiza experiencia.
   - Se sincroniza el frontend.

---

## 🔄 Comunicación en tiempo real

La aplicación utiliza Socket.IO para:

- Gestionar salas de batalla
- Emitir eventos de turno
- Notificar fin de combate
- Sincronizar estado entre jugadores

Esto permite que ambos clientes vean los turnos de combate de manera inmediata sin necesidad de refrescar la página.

---

## 📈 Sistema de experiencia y nivel

Cada victoria otorga experiencia al jugador.

Cuando la experiencia alcanza un umbral determinado:

- El jugador sube de nivel
- La experiencia restante se mantiene
- El cambio se persiste en base de datos

El frontend sincroniza estos datos tras finalizar la batalla para reflejar el nuevo estado del usuario.

---

## 🧩 Principios aplicados

El proyecto aplica varios conceptos clave:

- Separación de responsabilidades (Controller / Service)
- Persistencia desacoplada de la lógica de transporte
- Uso correcto de rutas específicas antes que dinámicas
- Sincronización entre datos efímeros (WebSocket) y persistentes (MongoDB)
- Manejo de ObjectId y populate en Mongoose
- Arquitectura modular escalable

---

## 🧪 Flujo de uso

1. Registrar dos usuarios.
2. Iniciar sesión en dos navegadores distintos.
3. Crear una batalla desde uno.
4. Unirse desde el otro.
5. Observar el combate en tiempo real.
6. Ver actualización automática de experiencia y nivel.

---

## 🎯 Objetivo técnico del proyecto

Demostrar integración completa entre:

- Autenticación segura
- API REST
- WebSockets
- Persistencia en base de datos
- Sincronización cliente-servidor
