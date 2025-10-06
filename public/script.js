// --- LOGIN (versión con múltiples usuarios) ---
const usuariosAutorizados = {
  "1014201517": "Daniel Rincón",
  "1019004954": "Edgar Forero",
  "1052380026": "Sandra Tellez",
  "1032506186": "Alexandra Bueno",
  "52046781": "Deisy Villalba",
  "1014288855": "Alejandra Bermudez",
  "1015405783": "Leandro Ariza",
  "1026285569": "Paula Salgado"
};

document.getElementById("loginBtn").addEventListener("click", () => {
  const cedula = document.getElementById("cedula").value.trim();
  const nombreUsuario = usuariosAutorizados[cedula];

  if (nombreUsuario) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.querySelector("header h1").textContent =
      `Bienvenido, ${nombreUsuario}`;
  } else {
    document.getElementById("error").textContent = "Cédula no autorizada.";
  }
});

document.getElementById("cerrarSesion").addEventListener("click", () => {
  document.getElementById("login").style.display = "block";
  document.getElementById("app").style.display = "none";
});


document.getElementById("cerrarSesion").addEventListener("click", () => {
  document.getElementById("login").style.display = "block";
  document.getElementById("app").style.display = "none";
});

// --- RESPONSABLES ---
const responsables = {
  "Instancias de Participación": "Edgar Forero",
  "Salud": "Sandra Tellez",
  "Educación": "Alexandra Bueno",
  "Subsidio Bono C": "Deisy Villalba",
  "Casa Mujer Respiro": "Alejandra Bermudez",
  "Casa del Adulto Mayor": "Leandro Ariza",
};

document.getElementById("oficina").addEventListener("change", (e) => {
  document.getElementById("responsable").value = responsables[e.target.value] || "";
});

// --- CALENDARIO ---
let calendarEl = document.getElementById("calendar");
let detalleDia = document.getElementById("detalleDia");
let listaEventos = document.getElementById("listaEventos");

let calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: "dayGridMonth",
  locale: "es",
  selectable: true,
  editable: true,
  height: "auto",
  dateClick: (info) => mostrarEventosDelDia(info.dateStr),
  eventClick: function (info) {
    if (confirm("¿Deseas eliminar este evento?")) {
      info.event.remove();
      guardarEventos();
    }
  },
  eventChange: guardarEventos,
});

calendar.render();

// --- CARGAR EVENTOS ---
function cargarEventos() {
  const guardados = JSON.parse(localStorage.getItem("eventos") || "[]");
  guardados.forEach((e) => calendar.addEvent(e));
}
cargarEventos();

// --- GUARDAR EVENTOS ---
function guardarEventos() {
  const eventos = calendar.getEvents().map((ev) => ({
    title: ev.title,
    start: ev.startStr,
    end: ev.endStr,
  }));
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

// --- AGREGAR NUEVA ACTIVIDAD ---
document.getElementById("formActividad").addEventListener("submit", (e) => {
  e.preventDefault();

  const oficina = document.getElementById("oficina").value;
  const responsable = document.getElementById("responsable").value;
  const fecha = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;
  const descripcion = document.getElementById("descripcion").value;

  if (!oficina || !fecha || !horaInicio || !horaFin || !descripcion) {
    alert("Por favor complete todos los campos.");
    return;
  }

  const evento = {
    title: `${oficina} (${responsable}) - ${descripcion}`,
    start: `${fecha}T${horaInicio}`,
    end: `${fecha}T${horaFin}`,
  };

  calendar.addEvent(evento);
  guardarEventos();
  e.target.reset();
  document.getElementById("responsable").value = "";
  alert("Actividad guardada exitosamente");
});

// --- MOSTRAR EVENTOS POR DÍA ---
function mostrarEventosDelDia(fechaStr) {
  const eventos = calendar.getEvents().filter((e) => e.startStr.startsWith(fechaStr));
  listaEventos.innerHTML = "";

  if (eventos.length === 0) {
    listaEventos.innerHTML = "<li>No hay actividades para este día.</li>";
  } else {
    eventos.forEach((e) => {
      const li = document.createElement("li");

      // Formatear horas de inicio y fin
      const horaInicio = e.start
        ? new Date(e.start).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
        : "";
      const horaFin = e.end
        ? new Date(e.end).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
        : "";

      li.textContent = `${e.title} — ${horaInicio} a ${horaFin}`;
      listaEventos.appendChild(li);
    });
  }

  detalleDia.classList.remove("oculto");
}
