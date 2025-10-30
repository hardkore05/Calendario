// =========================
// USUARIOS AUTORIZADOS
// =========================
const usuarios = {
  "80772128": { nombre: "Víctor Hugo Huertas Prada", oficina: "Alcaldía Local de Engativá", rol: "admin" },
  "1057581626": { nombre: "Samuel Camacho", oficina: "Área de Gestión de Desarrollo Local", rol: "admin" },
  "1014201517": { nombre: "Daniel Rincón", oficina: "Cultura y Deporte", rol: "user" },
  "1019004954": { nombre: "Edgar Forero", oficina: "Instancias de Participación", rol: "user" },
  "1052380026": { nombre: "Sandra Tellez", oficina: "Salud", rol: "user" },
  "1032506186": { nombre: "Alexandra Bueno", oficina: "Educación", rol: "user" },
  "52046781": { nombre: "Deisy Villalba", oficina: "Subsidio Bono C", rol: "user" },
  "1014288855": { nombre: "Alejandra Bermudez", oficina: "Casa Mujer Respiro", rol: "user" },
  "1015405783": { nombre: "Leandro Ariza", oficina: "Casa del Adulto Mayor", rol: "user" },
  "79880521": { nombre: "Nicolás Rodríguez", oficina: "Cultura y Deporte", rol: "user" },
  "1014264461": { nombre: "Fernanda Villamil", oficina: "Ambiente", rol: "user" },
  "5660739": { nombre: "Cristian Pérez", oficina: "Desarrollo Económico", rol: "user" },
  "80017445": { nombre: "Fredy Amado", oficina: "Enlace Social", rol: "user" },
  "79803436": { nombre: "Jheison Barrios", oficina: "PYBA", rol: "user" },
  "1026285569": { nombre: "Paula Salgado", oficina: "Enlace de Participación", rol: "user" }
};

let usuario = null;

// =========================
// LOGIN
// =========================
document.getElementById("loginBtn").addEventListener("click", () => {
  const cedula = document.getElementById("cedula").value.trim();
  usuario = usuarios[cedula];

  if (usuario) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.querySelector("header h1").textContent = `Bienvenido, ${usuario.nombre}`;
  } else {
    document.getElementById("error").textContent = "Cédula no autorizada.";
  }
});

// =========================
// CERRAR SESIÓN
// =========================
document.getElementById("cerrarSesion").addEventListener("click", () => {
  location.reload();
});

// =========================
// RESPONSABLES DE OFICINA
// =========================
const responsables = {
  "Instancias de Participación": "Edgar Forero",
  "Salud": "Sandra Tellez",
  "Educación": "Alexandra Bueno",
  "Subsidio Bono C": "Deisy Villalba",
  "Casa Mujer Respiro": "Alejandra Bermudez",
  "Casa del Adulto Mayor": "Leandro Ariza",
  "Cultura y Deporte": "Nicolás Rodríguez",
  "Ambiente": "Fernanda Villamil",
  "Desarrollo Económico": "Cristian Pérez",
  "Área de Gestión de Desarrollo Local": "Samuel Camacho",
  "Enlace Social": "Fredy Amado",
  "PYBA": "Jheison Barrios",
  "Alcaldía Local de Engativá": "Víctor Hugo Huertas Prada",
  "Enlace de Participación": "Paula Salgado"
};

document.getElementById("oficina").addEventListener("change", e => {
  document.getElementById("responsable").value = responsables[e.target.value] || "";
});

// =========================
// INICIALIZAR CALENDARIO
// =========================
const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
  initialView: "dayGridMonth",
  locale: "es",
  selectable: true,
  height: "auto",
  dateClick: info => mostrarEventosDelDia(info.dateStr)
});

calendar.render();
cargarEventos();

// =========================
// GUARDAR ACTIVIDAD
// =========================
document.getElementById("formActividad").addEventListener("submit", e => {
  e.preventDefault();

  const evento = {
    id: Date.now(),
    title: `${document.getElementById("oficina").value} - ${document.getElementById("descripcion").value}`,
    start: `${document.getElementById("fecha").value}T${document.getElementById("horaInicio").value}`,
    end: `${document.getElementById("fecha").value}T${document.getElementById("horaFin").value}`,
    meta: document.getElementById("meta").value,
    participantes: document.getElementById("participantes").value,
    poblacion: document.getElementById("poblacion").value,
    ubicacion: document.getElementById("ubicacion").value,
    requerimientos: document.getElementById("requerimientos").value,
    oficina: document.getElementById("oficina").value,
    responsable: document.getElementById("responsable").value,
    creadoPor: usuario.nombre,
    fechaRegistro: new Date().toLocaleString("es-CO"),
    estado: "Pendiente",
    evaluado: false
  };

  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  eventos.push(evento);
  localStorage.setItem("eventos", JSON.stringify(eventos));

  calendar.addEvent({ title: evento.title, start: evento.start, end: evento.end });
  e.target.reset();
  alert("Actividad guardada exitosamente");
});

// =========================
// MOSTRAR EVENTOS DEL DÍA
// =========================
function mostrarEventosDelDia(fechaStr) {
  const lista = document.getElementById("listaEventos");
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]")
    .filter(e => e.start.startsWith(fechaStr));

  lista.innerHTML = "";
  if (eventos.length === 0) {
    lista.innerHTML = "<li>No hay actividades para este día.</li>";
  } else {
    eventos.forEach(e => {
      const li = document.createElement("li");
      li.innerHTML = `
        <b>${e.title}</b><br>
        Responsable: ${e.responsable}<br>
        Meta: ${e.meta || "-"}<br>
        Participantes: ${e.participantes || "-"}<br>
        Población: ${e.poblacion || "-"}<br>
        Ubicación: ${e.ubicacion || "-"}<br>
        Requerimientos: ${e.requerimientos || "-"}<br>
        Registrado por: ${e.creadoPor}<br>
        Fecha registro: ${e.fechaRegistro}<br>
        Estado: <b>${e.estado}</b>`;

      // Botones de administración
      if (usuario.rol === "admin") {
        const divBtns = document.createElement("div");
        divBtns.className = "botones-admin";

        const btnAceptar = document.createElement("button");
        btnAceptar.textContent = "Aceptar";
        const btnRechazar = document.createElement("button");
        btnRechazar.textContent = "Rechazar";
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";

        if (!e.evaluado) {
          btnAceptar.onclick = () => cambiarEstado(e.id, "Aceptado");
          btnRechazar.onclick = () => cambiarEstado(e.id, "Rechazado");
        } else {
          btnAceptar.disabled = true;
          btnRechazar.disabled = true;
        }

        btnEliminar.onclick = () => eliminarEvento(e.id);

        divBtns.append(btnAceptar, btnRechazar, btnEliminar);
        li.appendChild(divBtns);
      }

      lista.appendChild(li);
    });
  }

  document.getElementById("detalleDia").classList.remove("oculto");
}

// =========================
// FUNCIONES AUXILIARES
// =========================
function cargarEventos() {
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  eventos.forEach(e => calendar.addEvent({ title: e.title, start: e.start, end: e.end }));
}

function cambiarEstado(id, nuevoEstado) {
  const eventos = JSON.parse(localStorage.getItem("eventos"));
  const evento = eventos.find(ev => ev.id === id);
  if (evento && !evento.evaluado) {
    evento.estado = nuevoEstado;
    evento.evaluado = true;
    localStorage.setItem("eventos", JSON.stringify(eventos));
    alert(`Actividad ${nuevoEstado}`);
    location.reload();
  }
}

function eliminarEvento(id) {
  if (!confirm("¿Desea eliminar esta actividad?")) return;
  let eventos = JSON.parse(localStorage.getItem("eventos"));
  eventos = eventos.filter(e => e.id !== id);
  localStorage.setItem("eventos", JSON.stringify(eventos));
  alert("Actividad eliminada");
  location.reload();
}




