// =========================
// USUARIOS AUTORIZADOS
// =========================
const usuarios = {
  "80772128": "Victor Hugo Huertas Prada",
  "1057581626": "Samuel Camacho",
  "1014201517": "Daniel Rincón",
  "1031178064": "Sandra Téllez",
  "1032506186": "Alexandra Bueno",
  "1019004954": "Edgar Forero"
};

// Responsables con privilegios
const responsablesAdmin = ["80772128", "1057581626"];

let usuarioActual = null;
let calendario;

// =========================
// LOGIN
// =========================
document.getElementById("loginBtn").addEventListener("click", () => {
  const cedula = document.getElementById("cedula").value.trim();
  const error = document.getElementById("error");

  if (usuarios[cedula]) {
    usuarioActual = cedula;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("responsable").value = usuarios[cedula];
  } else {
    error.textContent = "Cédula no registrada.";
  }
});

// =========================
// CERRAR SESIÓN
// =========================
document.getElementById("cerrarSesion").addEventListener("click", () => {
  usuarioActual = null;
  document.getElementById("app").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("cedula").value = "";
});

// =========================
// INICIALIZAR CALENDARIO
// =========================
document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  calendario = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    editable: false,
    eventClick: mostrarDetalleEvento,
    events: JSON.parse(localStorage.getItem("actividades")) || []
  });

  calendario.render();
});

// =========================
// GUARDAR ACTIVIDAD
// =========================
document.getElementById("formActividad").addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevaActividad = {
    id: Date.now().toString(),
    title: document.getElementById("descripcion").value,
    start: document.getElementById("fecha").value,
    extendedProps: {
      oficina: document.getElementById("oficina").value,
      responsable: document.getElementById("responsable").value,
      horaInicio: document.getElementById("horaInicio").value,
      horaFin: document.getElementById("horaFin").value,
      meta: document.getElementById("meta").value,
      participantes: document.getElementById("participantes").value,
      poblacion: document.getElementById("poblacion").value,
      ubicacion: document.getElementById("ubicacion").value,
      requerimientos: document.getElementById("requerimientos").value,
      estado: "Pendiente",
      aprobadoPor: null,
      fechaRegistro: new Date().toLocaleString()
    }
  };

  let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  actividades.push(nuevaActividad);
  localStorage.setItem("actividades", JSON.stringify(actividades));

  calendario.addEvent(nuevaActividad);
  alert("Actividad registrada correctamente.");

  this.reset();
});

// =========================
// MOSTRAR DETALLE DEL EVENTO
// =========================
function mostrarDetalleEvento(info) {
  const evento = info.event;
  const props = evento.extendedProps;
  const lista = document.getElementById("listaEventos");
  lista.innerHTML = "";

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${evento.title}</strong><br>
    📅 Fecha: ${evento.startStr}<br>
    🏢 Oficina: ${props.oficina}<br>
    👤 Responsable: ${props.responsable}<br>
    🕒 ${props.horaInicio} - ${props.horaFin}<br>
    🎯 <b>META:</b> ${props.meta}<br>
    👥 <b>PARTICIPANTES:</b> ${props.participantes}<br>
    🧍‍♂️ <b>POBLACIÓN BENEFICIADA:</b> ${props.poblacion}<br>
    📍 <b>UBICACIÓN:</b> ${props.ubicacion}<br>
    ⚙️ <b>REQUERIMIENTOS:</b> ${props.requerimientos}<br>
    🗓️ <b>Registrado el:</b> ${props.fechaRegistro}<br>
    📌 <b>Estado:</b> ${props.estado}
    ${props.aprobadoPor ? `<br>✅ ${props.aprobadoPor}` : ""}
  `;

  // Botones para administradores
  if (responsablesAdmin.includes(usuarioActual)) {
    const aceptarBtn = document.createElement("button");
    aceptarBtn.textContent = "Aceptar";
    aceptarBtn.onclick = () => cambiarEstado(evento.id, "Aceptada");

    const rechazarBtn = document.createElement("button");
    rechazarBtn.textContent = "Rechazar";
    rechazarBtn.onclick = () => cambiarEstado(evento.id, "Rechazada");

    const borrarBtn = document.createElement("button");
    borrarBtn.textContent = "Eliminar";
    borrarBtn.onclick = () => eliminarActividad(evento.id);

    // Desactivar si ya fue aceptada o rechazada
    if (props.estado !== "Pendiente") {
      aceptarBtn.disabled = true;
      rechazarBtn.disabled = true;
    }

    li.appendChild(document.createElement("br"));
    li.appendChild(aceptarBtn);
    li.appendChild(rechazarBtn);
    li.appendChild(borrarBtn);
  }

  lista.appendChild(li);
  document.getElementById("detalleDia").classList.remove("oculto");
}

// =========================
// CAMBIAR ESTADO
// =========================
function cambiarEstado(id, nuevoEstado) {
  let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  actividades = actividades.map(a => {
    if (a.id === id && a.extendedProps.estado === "Pendiente") {
      a.extendedProps.estado = nuevoEstado;
      a.extendedProps.aprobadoPor = usuarios[usuarioActual];
    }
    return a;
  });
  localStorage.setItem("actividades", JSON.stringify(actividades));
  actualizarCalendario();
}

// =========================
// ELIMINAR ACTIVIDAD
// =========================
function eliminarActividad(id) {
  if (!confirm("¿Desea eliminar esta actividad?")) return;

  let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  actividades = actividades.filter(a => a.id !== id);
  localStorage.setItem("actividades", JSON.stringify(actividades));
  actualizarCalendario();
}

// =========================
// EXPORTAR A EXCEL
// =========================
document.getElementById("exportExcel").addEventListener("click", () => {
  const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  if (actividades.length === 0) return alert("No hay datos para exportar.");

  const filas = actividades.map(a => ({
    Fecha: a.start,
    Oficina: a.extendedProps.oficina,
    Responsable: a.extendedProps.responsable,
    Meta: a.extendedProps.meta,
    Participantes: a.extendedProps.participantes,
    Poblacion: a.extendedProps.poblacion,
    Ubicacion: a.extendedProps.ubicacion,
    Requerimientos: a.extendedProps.requerimientos,
    Estado: a.extendedProps.estado,
    AprobadoPor: a.extendedProps.aprobadoPor || "",
    FechaRegistro: a.extendedProps.fechaRegistro
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(filas);
  XLSX.utils.book_append_sheet(wb, ws, "Actividades");
  XLSX.writeFile(wb, "actividades.xlsx");
});

// =========================
// EXPORTAR A PDF
// =========================
document.getElementById("exportPDF").addEventListener("click", () => {
  const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  if (actividades.length === 0) return alert("No hay datos para exportar.");

  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("Reporte de Actividades", 14, 15);

  const filas = actividades.map(a => [
    a.start,
    a.extendedProps.oficina,
    a.extendedProps.responsable,
    a.extendedProps.meta,
    a.extendedProps.estado
  ]);

  doc.autoTable({
    head: [["Fecha", "Oficina", "Responsable", "Meta", "Estado"]],
    body: filas,
    startY: 25,
  });

  doc.save("actividades.pdf");
});

// =========================
// REFRESCAR CALENDARIO
// =========================
function actualizarCalendario() {
  calendario.removeAllEvents();
  const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  actividades.forEach(a => calendario.addEvent(a));
  alert("Registro actualizado.");
}



