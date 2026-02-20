import { io, Socket } from "socket.io-client";

const API = "http://localhost:3000/api";

let token = "";
let usuarioActual: any = null;
let batallaId = "";
let socket: Socket;

const panel = document.getElementById("panel")!;
const nombreUsuarioSpan = document.getElementById("nombreUsuario")!;
const listaPersonajes = document.getElementById("listaPersonajes")!;
const personajeSelect = document.getElementById("personajeSelect") as HTMLSelectElement;
const logsUl = document.getElementById("logs")!;
const estadoBatalla = document.getElementById("estadoBatalla")!;
const oponenteSelect = document.getElementById("oponenteSelect") as HTMLSelectElement;
const nivelUsuarioSpan = document.getElementById("nivelUsuario")!;
const expUsuarioSpan = document.getElementById("expUsuario")!;

function addLog(text: string) {
  const li = document.createElement("li");
  li.textContent = text;
  logsUl.appendChild(li);
}

function mostrarPanel() {
  panel.style.display = "block";
  document.getElementById("login")!.style.display = "none";
  document.getElementById("registro")!.style.display = "none";
}

async function cargarPersonajes() {
  const res = await fetch(`${API}/personajes`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const personajes = await res.json();

  listaPersonajes.innerHTML = "";
  personajeSelect.innerHTML = "";

  personajes.forEach((p: any) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} (vida: ${p.vida}, ataque: ${p.ataque}, nivel: ${p.nivel})`;
    listaPersonajes.appendChild(li);

    const option = document.createElement("option");
    option.value = p._id;
    option.textContent = p.nombre;
    personajeSelect.appendChild(option);
  });
}

async function cargarUsuarios() {
  const res = await fetch(`${API}/users`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const usuarios = await res.json();

  if (!Array.isArray(usuarios)) {
    console.log("Respuesta inesperada usuarios:", usuarios);
    return;
  }

  oponenteSelect.innerHTML = "";

  usuarios
    .filter((u: any) => u._id !== usuarioActual._id) // excluirte a ti
    .forEach((u: any) => {
      const option = document.createElement("option");
      option.value = u._id;
      option.textContent = `${u.nombre} (nivel ${u.nivel})`;
      oponenteSelect.appendChild(option);
    });
}

const listaBatallas = document.getElementById("listaBatallas")!;

async function cargarBatallas() {
  const res = await fetch(`${API}/batalla`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const batallas = await res.json();

  listaBatallas.innerHTML = "";

  if (!Array.isArray(batallas)) return;

  batallas.forEach((b: any) => {

    const li = document.createElement("li");

    li.textContent = `Batalla creada por ${b.usuario1?.nombre} - ID: ${b._id}`;

    const btnUnirse = document.createElement("button");
    btnUnirse.textContent = "Unirse";

    btnUnirse.addEventListener("click", () => {
      batallaId = b._id;
      socket.emit("unirse-batalla", batallaId);
      estadoBatalla.textContent = "Uniéndote a batalla...";
    });

    li.appendChild(btnUnirse);
    listaBatallas.appendChild(li);
  });
}

async function refrescarUsuario() {
  const res = await fetch(`${API}/users/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  usuarioActual = data;

  nivelUsuarioSpan.textContent = usuarioActual.nivel;
  expUsuarioSpan.textContent = usuarioActual.experiencia;
  console.log("RESPUESTA /users/me:", data);
}

document.getElementById("btnRegister")!.addEventListener("click", async () => {
  const nombre = (document.getElementById("regNombre") as HTMLInputElement).value;
  const email = (document.getElementById("regEmail") as HTMLInputElement).value;
  const password = (document.getElementById("regPass") as HTMLInputElement).value;

  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });

  alert("Registrado correctamente");
});

document.getElementById("btnLogin")!.addEventListener("click", async () => {
  const email = (document.getElementById("loginEmail") as HTMLInputElement).value;
  const password = (document.getElementById("loginPass") as HTMLInputElement).value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  token = data.access_token;
  usuarioActual = data.user;

  nombreUsuarioSpan.textContent = usuarioActual.nombre;
  nivelUsuarioSpan.textContent = usuarioActual.nivel;
  expUsuarioSpan.textContent = usuarioActual.experiencia;

  mostrarPanel();
  cargarPersonajes();
  cargarUsuarios()
  cargarBatallas()

  socket = io("http://localhost:3000", {
    auth: { token }
  });

  socket.on("connect", () => {
    console.log("Conectado:", socket.id);
  });

  socket.on("jugador-unido", (data) => {
    estadoBatalla.textContent = "Ambos jugadores conectados. Iniciando...";
  });

  socket.on("turno", (data) => {
    addLog(`${data.atacante} deja vida en ${data.vidaRestante}`);
  });

  socket.on("fin-batalla", async(data) => {
    addLog(`🏆 Ganador: ${data.ganador}`);
    estadoBatalla.textContent = "Batalla finalizada";
    console.log("REFRESCANDO USUARIO...");
    await refrescarUsuario()
  });
});

document.getElementById("btnRefrescarBatallas")!.addEventListener("click", cargarBatallas);

document.getElementById("btnCrearBatalla")!.addEventListener("click", async () => {
  const idUsuarioOponente = oponenteSelect.value;
  const idPersonaje = personajeSelect.value;
  const res = await fetch(`${API}/batalla/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      idUsuarioOponente,
      idPersonaje,
      idPersonajeOponente: idPersonaje
    })
  });

  const batalla = await res.json();
  batallaId = batalla._id;

  estadoBatalla.textContent = "Esperando oponente...";
  socket.emit("unirse-batalla", batallaId);
});