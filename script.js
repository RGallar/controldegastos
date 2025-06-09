let saldoInicial = 0;
let saldoActual = 0;
let gastos = [];

// Inicializar desde localStorage
window.onload = () => {
  const savedSaldo = localStorage.getItem("saldoInicial");
  const savedGastos = localStorage.getItem("gastos");

  saldoInicial = savedSaldo ? parseInt(savedSaldo) : 700000;
  gastos = savedGastos ? JSON.parse(savedGastos) : [];

  document.getElementById("saldo").value = saldoInicial;
  renderGastos();
  recalcularSaldo();
};

function guardarEnLocalStorage() {
  localStorage.setItem("saldoInicial", saldoInicial);
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function actualizarSaldo() {
  const nuevoSaldo = parseInt(document.getElementById("saldo").value);
  if (!isNaN(nuevoSaldo) && nuevoSaldo >= 0) {
    saldoInicial = nuevoSaldo;
    guardarEnLocalStorage();
    recalcularSaldo();
  }
}

function sumarSaldo() {
  const extra = parseInt(document.getElementById("agregarSaldo").value);
  if (!isNaN(extra) && extra > 0) {
    saldoInicial += extra;
    document.getElementById("saldo").value = saldoInicial;
    document.getElementById("agregarSaldo").value = "";
    guardarEnLocalStorage();
    recalcularSaldo();
  }
}

function agregarGasto() {
  const nombre = document.getElementById("nombreGasto").value.trim();
  const monto = parseInt(document.getElementById("montoGasto").value);

  if (nombre && !isNaN(monto) && monto > 0) {
    const gasto = { id: Date.now(), nombre, monto };
    gastos.push(gasto);
    document.getElementById("nombreGasto").value = "";
    document.getElementById("montoGasto").value = "";
    guardarEnLocalStorage();
    renderGastos();
    recalcularSaldo();
  }
}

function renderGastos() {
  const lista = document.getElementById("listaGastos");
  lista.innerHTML = "";

  gastos.forEach((gasto) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${gasto.nombre}: $${gasto.monto.toLocaleString()}</span>
      <div class="actions">
        <button onclick="editarGasto(${gasto.id})">✏️</button>
        <button class="delete" onclick="eliminarGasto(${gasto.id})">🗑️</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

function eliminarGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
  guardarEnLocalStorage();
  renderGastos();
  recalcularSaldo();
}

function editarGasto(id) {
  const gasto = gastos.find(g => g.id === id);
  const nuevoNombre = prompt("Editar nombre del gasto:", gasto.nombre);
  const nuevoMonto = parseInt(prompt("Editar monto del gasto:", gasto.monto));

  if (nuevoNombre && !isNaN(nuevoMonto) && nuevoMonto > 0) {
    gasto.nombre = nuevoNombre;
    gasto.monto = nuevoMonto;
    guardarEnLocalStorage();
    renderGastos();
    recalcularSaldo();
  }
}

function recalcularSaldo() {
  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  saldoActual = saldoInicial - totalGastos;
  document.getElementById("saldoRestante").textContent = saldoActual.toLocaleString();
}
