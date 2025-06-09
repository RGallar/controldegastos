let saldo = 0;
let gastos = [];

function guardarDatos() {
  localStorage.setItem("saldoInicial", saldo + obtenerTotalGastos());
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function cargarDatos() {
  const saldoGuardado = parseInt(localStorage.getItem("saldoInicial"));
  const gastosGuardados = JSON.parse(localStorage.getItem("gastos"));

  if (!isNaN(saldoGuardado)) {
    gastos = gastosGuardados || [];
    saldo = saldoGuardado - obtenerTotalGastos();
    document.getElementById("saldo").value = saldoGuardado;
    actualizarSaldoRestante();
    renderizarGastos();
  }
}

function establecerSaldo() {
  const inputSaldo = document.getElementById("saldo");
  const nuevoSaldo = parseInt(inputSaldo.value);

  if (isNaN(nuevoSaldo) || nuevoSaldo < 0) {
    alert("Ingresa un saldo válido.");
    return;
  }

  saldo = nuevoSaldo - obtenerTotalGastos();
  guardarDatos();
  actualizarSaldoRestante();
}

function agregarGasto() {
  const descripcion = document.getElementById("descripcion").value.trim();
  const monto = parseInt(document.getElementById("monto").value);

  if (!descripcion || isNaN(monto) || monto <= 0) {
    alert("Ingresa una descripción y monto válidos.");
    return;
  }

  if (monto > saldo) {
    alert("Saldo insuficiente para este gasto.");
    return;
  }

  gastos.push({ descripcion, monto });
  saldo -= monto;
  guardarDatos();
  actualizarSaldoRestante();
  renderizarGastos();

  document.getElementById("descripcion").value = "";
  document.getElementById("monto").value = "";
}

function editarGasto(index) {
  const nuevoDesc = prompt("Nueva descripción:", gastos[index].descripcion);
  if (nuevoDesc === null || nuevoDesc.trim() === "") return;

  const nuevoMonto = parseInt(prompt("Nuevo monto:", gastos[index].monto));
  if (isNaN(nuevoMonto) || nuevoMonto <= 0) {
    alert("Monto inválido.");
    return;
  }

  saldo += gastos[index].monto; // Reintegrar saldo anterior
  if (nuevoMonto > saldo) {
    alert("Saldo insuficiente.");
    saldo -= gastos[index].monto; // Volver al estado anterior
    return;
  }

  gastos[index] = { descripcion: nuevoDesc, monto: nuevoMonto };
  saldo -= nuevoMonto;
  guardarDatos();
  actualizarSaldoRestante();
  renderizarGastos();
}

function eliminarGasto(index) {
  saldo += gastos[index].monto;
  gastos.splice(index, 1);
  guardarDatos();
  actualizarSaldoRestante();
  renderizarGastos();
}

function renderizarGastos() {
  const lista = document.getElementById("listaGastos");
  lista.innerHTML = "";

  gastos.forEach((gasto, index) => {
    const item = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = `${gasto.descripcion} - $${gasto.monto}`;

    const acciones = document.createElement("div");
    acciones.className = "gasto-actions";

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => editarGasto(index);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "delete-btn";
    btnEliminar.onclick = () => eliminarGasto(index);

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    item.appendChild(texto);
    item.appendChild(acciones);

    lista.appendChild(item);
  });
}

function actualizarSaldoRestante() {
  document.getElementById("saldoRestante").textContent = `Saldo Restante: $${saldo}`;
}

function obtenerTotalGastos() {
  return gastos.reduce((acc, g) => acc + g.monto, 0);
}

// Tema oscuro
function cambiarModo() {
  const body = document.body;
  const actual = body.getAttribute("data-tema") || "claro";
  const nuevo = actual === "oscuro" ? "claro" : "oscuro";
  body.setAttribute("data-tema", nuevo);
  localStorage.setItem("modo", nuevo);

  const toggle = document.getElementById("modoToggle");
  toggle.textContent = nuevo === "oscuro" ? "☀️" : "🌙";
}

function cargarTema() {
  const modo = localStorage.getItem("modo") || "claro";
  document.body.setAttribute("data-tema", modo);
  document.getElementById("modoToggle").textContent = modo === "oscuro" ? "☀️" : "🌙";
}

// Inicialización
cargarTema();
cargarDatos();

function detectarCelular() {
  const esMobile = window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent);
  if (esMobile) {
    document.body.classList.add('mobile');
  } else {
    document.body.classList.remove('mobile');
  }
}

// Detectar al cargar y al redimensionar
detectarCelular();
window.addEventListener('resize', detectarCelular);

