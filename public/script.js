// =========================
// USUARIOS AUTORIZADOS
// =========================
const usuarios = {
  "80772128": { nombre: "Víctor Hugo Huertas Prada", oficina: "Alcaldía Local de Engativá", rol: "admin" },
  "1057581626": { nombre: "Samuel Camacho", oficina: "Área de Gestión de Desarrollo Local", rol: "admin" },
  "1014201517": { nombre: "Daniel Rincón", oficina: " ", rol: "user" },
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
// LISTA DE METAS DESPLEGABLE
// =========================
const metas = [
  "Fortalecer 100 organizaciones comunitarias a través de capacidades para promover acciones de corresponsabilidad en la gestión de la seguridad y la convivencia.",
  "Implementar 4 acciones formativas diferenciales para la promoción de la convivencia ciudadana.",
  "Vincular 4000 personas en acciones para la prevención del feminicidio y la violencia contra la mujer.",
  "Suministrar 4 dotaciones a organismos de seguridad.",
  "Fortalecer 4 programas de abordaje de conflictividad escolar para la convivencia con enfoque restaurativo.",
  "Fortalecer 8 actores comunitarios con herramientas y capacidades para la implementación de un enfoque restaurativo para la justicia y la convivencia.",
  "Implementar 4 proyectos comunitarios en la localidad, para la apropiación del Código Nacional de Seguridad y Convivencia Ciudadana.",
  "Ejecutar 4 programas comunitarios con enfoque restaurativo para el cuidado del espacio público y del medio ambiente.",
  "Realizar 4 acuerdos para la organización, la recuperación, el cuidado, el embellecimiento, la sostenibilidad, el mejoramiento y el aprovechamiento económico del espacio público.",
  "Intervenir 2.500 metros cuadrados de elementos del sistema de espacio público peatonal con acciones de construcción y/o conservación.",
  "Implementar 4 estrategias de seguridad y convivencia a través de gestores locales que permitan el uso y disfrute del espacio público.",
  "Beneficiar 3200 jóvenes con transferencias condicionadas y acompañamiento psicosocial para la promoción al acceso y permanencia a oportunidades de formación y empleabilidad.",
  "Atender 10.000 personas con apoyos que contribuyan al ingreso mínimo garantizado.",
  "Beneficiar 3650 personas mayores con apoyo económico tipo C.",
  "Habilitar 230 cupos para la atención de población en inseguridad alimentaria y nutricional del Distrito Capital, a través de comedores comunitarios.",
  "Implementar 4 programas de actividad física para el bienestar.",
  "Realizar 4 campañas de promoción de la salud física y mental.",
  "Beneficiar 400 personas mayores en programas de envejecimiento activo.",
  "Fortalecer 10 organizaciones de personas con discapacidad en la localidad.",
  "Vincular 1000 personas víctimas del conflicto armado en procesos de atención integral.",
  "Desarrollar 6 proyectos deportivos comunitarios.",
  "Realizar 4 eventos recreativos y deportivos por la inclusión.",
  "Formar 600 personas en los campos artísticos, interculturales, culturales y/o patrimoniales.",
  "Beneficiar 20 organizaciones artísticas y culturales con elementos entregados.",
  "Atender 900 animales en los programas de brigadas médicas, urgencias veterinarias y adopciones.",
  "Vincular 4000 personas en acciones educativas en temas de protección y bienestar animal.",
  "Esterilizar 8000 perros y gatos incluyendo los que están en condición de vulnerabilidad.",
  "Dotar 10 sedes educativas urbanas y rurales con recursos pedagógicos y/o tecnológicos.",
  "Beneficiar 250 personas con apoyo para la educación posmedia.",
  "Beneficiar 250 estudiantes con apoyo de sostenimiento para la permanencia en la educación posmedia.",
  "Fortalecer 100 unidades productivas.",
  "Implementar 4 procesos de formación para el empleo y emprendimiento.",
  "Otorgar 100 estímulos de apoyo al sector artístico y cultural.",
  "Beneficiar 10 colectivos u organizaciones recreodeportivas inscritas en el Banco que implementen iniciativas de carácter barrial con apoyos económicos.",
  "Beneficiar 11.200 personas en actividades recreo-deportivas comunitarias.",
  "Capacitar 600 personas en los campos deportivos.",
  "Realizar 20 eventos de promoción, circulación y apropiación de actividades artísticas, culturales y patrimoniales.",
  "Capacitar 600 personas en los campos artísticos, interculturales, culturales y/o patrimoniales.",
  "Fortalecer 200 Organizaciones, JAC e Instancias de participación ciudadana.",
  "Capacitar 1000 personas a través de procesos de formación para la participación de manera virtual y presencial.",
  "Desarrollar 4 acciones orientadas a la ciudadanía en el marco de la estrategia “Bogotaneidad”.",
  "Fortalecer 1 unidad de innovación pública y social a nivel local.",
  "Concertar e implementar 1 iniciativa de inversión local con los pueblos indígenas.",
  "Concertar e implementar 1 iniciativa de inversión local con las comunidades negras, afrocolombianas y palenqueras.",
  "Rehabilitar 20 salones comunales y/o casas de participación.",
  "Dotar 40 organizaciones comunales.",
  "Fortalecer 30 medios comunitarios y alternativos.",
  "Implementar 4 programas comunitarios de cultura ciudadana.",
  "Ejecutar 4 proyectos comunitarios de convivencia.",
  "Fortalecer 8 actores sociales en mediación y conciliación.",
  "Suministrar 4 dotaciones tecnológicas para la seguridad y convivencia."
  "No Aplica"
];

const selectMeta = document.getElementById("meta");
if (selectMeta) {
  metas.forEach(meta => {
    const option = document.createElement("option");
    option.value = meta;
    option.textContent = meta;
    selectMeta.appendChild(option);
  });
}

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

fetch("/api/eventos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(evento)
})
.then(res => res.json())
.then(() => {
  calendar.addEvent({ title: evento.title, start: evento.start, end: evento.end });
  e.target.reset();
  alert("Actividad guardada exitosamente");
});

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
fetch("/api/eventos")
  .then(res => res.json())
  .then(eventos => {
    eventos.forEach(e => calendar.addEvent({ title: e.title, start: e.start, end: e.end }));
  });

function cambiarEstado(id, nuevoEstado) {
  fetch(`/api/eventos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado, evaluado: true })
  })
  .then(res => res.json())
  .then(() => {
    alert(`Actividad ${nuevoEstado}`);
    location.reload();
  });
}

function eliminarEvento(id) {
  if (!confirm("¿Desea eliminar esta actividad?")) return;
  let eventos = JSON.parse(localStorage.getItem("eventos"));
  eventos = eventos.filter(e => e.id !== id);
  localStorage.setItem("eventos", JSON.stringify(eventos));
  alert("Actividad eliminada");
  location.reload();
}





