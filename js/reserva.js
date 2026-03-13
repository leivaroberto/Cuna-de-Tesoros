(function () {
  function formatDateISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // "YYYY-MM-DD" -> Date en horario local (evita corrimiento por UTC)
  function parseISODateToLocalDate(iso) {
    const parts = String(iso).split("-");
    if (parts.length !== 3) return new Date(NaN);
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    return new Date(y, m - 1, d);
  }

  // feriados
  const feriados = [
    "2026-01-01",
    "2026-03-24",
    "2026-04-02",
    "2026-05-01",
    "2026-05-25",
    "2026-06-20",
    "2026-07-09",
    "2026-08-17",
    "2026-10-12",
    "2026-11-20",
    "2026-12-08",
    "2026-12-25",
  ];

  const URL_SCRIPT =
    "https://script.google.com/macros/s/AKfycbzuNqjTKeMwG53sc7IU-CZaaxbLvYJr-VhHBgypELsndqXN_sGJJxjkvfFiVMfjDL6d/exec";

  function reservar() {
    const fecha = document.getElementById("fecha")?.value;
    const horaSelect = document.getElementById("hora");
    const hora = horaSelect?.value;
    const nombre = document.getElementById("nombre")?.value;
    const telefono = document.getElementById("telefono")?.value;
    const email = document.getElementById("email")?.value;

    if (!fecha || !hora || !nombre || !telefono || !email) {
      const mensaje = document.getElementById("mensaje");
      if (mensaje) mensaje.innerHTML = "⚠ Complete todos los campos";
      return;
    }

    const mensaje = document.getElementById("mensaje");
    if (mensaje) mensaje.innerHTML = "Reservando...";

    const opcionSeleccionada =
      horaSelect?.selectedOptions && horaSelect.selectedOptions[0]
        ? horaSelect.selectedOptions[0]
        : null;
    if (opcionSeleccionada && opcionSeleccionada.disabled) {
      if (mensaje) mensaje.innerHTML = "Ese horario ya no esta disponible";
      return;
    }

    const btnReservar = document.getElementById("btnReservar");
    if (btnReservar) btnReservar.disabled = true;

    const datos = new FormData();
    datos.append("fecha", fecha);
    datos.append("hora", hora);
    datos.append("nombre", nombre);
    datos.append("telefono", telefono);
    datos.append("email", email);

    fetch(URL_SCRIPT, {
      method: "POST",
      body: datos,
    })
      .then((res) => res.text())
      .then((res) => {
        if (res === "ok") {
          if (mensaje) mensaje.innerHTML = "✔ Entrevista reservada correctamente";
        } else if (res === "ocupado") {
          if (mensaje) mensaje.innerHTML = "⚠ Ese horario ya está reservado";
        } else {
          if (mensaje) mensaje.innerHTML = "Error al reservar";
        }
      })
      .catch((error) => {
        console.error(error);
        if (mensaje) mensaje.innerHTML = "Error al reservar";
      })
      .finally(() => {
        if (btnReservar) btnReservar.disabled = false;
      });
  }

  function cargarHorariosOcupados(fecha) {
    const select = document.getElementById("hora");
    if (!select) return;

    const opciones = select.options;
    select.disabled = true;
    if (opciones && opciones.length > 0) {
      opciones[0].textContent = "Cargando horarios...";
    }

    fetch(URL_SCRIPT + "?fecha=" + encodeURIComponent(fecha))
      .then((res) => res.json())
      .then((horasOcupadas) => {
        if (!Array.isArray(horasOcupadas)) horasOcupadas = [];
        horasOcupadas = horasOcupadas.map((h) => String(h).trim());
        const ocupadas = new Set(horasOcupadas);

        for (let i = 0; i < opciones.length; i++) {
          if (opciones[i].value === "") continue;
          opciones[i].disabled = false;
          if (ocupadas.has(opciones[i].value)) {
            opciones[i].disabled = true;
          }
        }

        const mensaje = document.getElementById("mensaje");
        if (select.value && ocupadas.has(select.value)) {
          select.value = "";
          if (mensaje)
            mensaje.innerHTML =
              "El horario que habias elegido ya esta ocupado";
        }
      })
      .catch((error) => {
        console.error(error);
        const mensaje = document.getElementById("mensaje");
        if (mensaje)
          mensaje.innerHTML = "No se pudieron cargar los horarios ocupados";
      })
      .finally(() => {
        if (opciones && opciones.length > 0) {
          opciones[0].textContent = "Seleccionar horario";
        }
        select.disabled = false;
      });
  }

  // Necesario para el onclick="reservar()" del botón
  window.reservar = reservar;

  const fechaInput = document.getElementById("fecha");
  if (!fechaInput) return;

  const hoy = formatDateISO(new Date());
  fechaInput.min = hoy;

  fechaInput.addEventListener("change", function () {
    const fechaSeleccionada = this.value;
    const fecha = parseISODateToLocalDate(fechaSeleccionada);
    const dia = fecha.getDay();

    if (dia === 0 || dia === 6) {
      alert("Las entrevistas se realizan solo de lunes a viernes");
      this.value = "";
      return;
    }

    if (feriados.includes(fechaSeleccionada)) {
      alert("Ese día es feriado");
      this.value = "";
      return;
    }

    cargarHorariosOcupados(fechaSeleccionada);
  });
})();

