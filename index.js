
    // --- Lógica de Estado ---
    let registros = JSON.parse(localStorage.getItem('app_data')) || [];
    let contador = parseInt(localStorage.getItem('app_counter')) || 0;

    // --- Inicialización ---
    actualizarVista();

    // --- Funciones Sección 1 ---
    function changeCounter(val) {
        contador += val;
        localStorage.setItem('app_counter', contador);
        document.getElementById('counterValue').innerText = contador;
    }

    // --- Funciones Sección 2 y 3 ---
    function registrarDatos() {
        const cotiz = parseFloat(document.getElementById('inCotizacion').value) || 0;
        const trasl = parseFloat(document.getElementById('inTraslado').value) || 0;
        const tiempo = parseFloat(document.getElementById('inTiempo').value) || 0;

        if(cotiz === 0 && trasl === 0) return alert("Ingresa valores válidos");

        const nuevoRegistro = {
            id: Date.now(),
            cotizacion: cotiz,
            traslado: trasl,
            tiempo: tiempo,
            neto: cotiz - trasl,
            negocio: (cotiz - trasl) * tiempo
        };

        registros.push(nuevoRegistro);
        guardarYActualizar();
        
        // Limpiar inputs
        document.getElementById('inCotizacion').value = '';
        document.getElementById('inTraslado').value = '';
        document.getElementById('inTiempo').value = '';
    }

    function guardarYActualizar() {
        localStorage.setItem('app_data', JSON.stringify(registros));
        actualizarVista();
    }

    function actualizarVista() {
        document.getElementById('counterValue').innerText = contador;
        const lista = document.getElementById('listaRegistros');
        lista.innerHTML = '';

        let tCotiz = 0, tTrasl = 0, tNeto = 0, tNegocio = 0;

        registros.forEach((reg, index) => {
            tCotiz += reg.cotizacion;
            tTrasl += reg.traslado;
            tNeto += reg.neto;
            tNegocio += reg.negocio;

            lista.innerHTML += `
                <div class="list-item">
                    <span>Reg #${index + 1}: Cotiz $${reg.cotizacion} | Negocio: $${reg.negocio}</span>
                    <button class="btn-danger" style="padding: 2px 8px" onclick="eliminarRegistro(${reg.id})">Eliminar</button>
                </div>
            `;
        });

        document.getElementById('resCotiz').innerText = tCotiz.toLocaleString();
        document.getElementById('resTrasl').innerText = tTrasl.toLocaleString();
        document.getElementById('resNeto').innerText = tNeto.toLocaleString();
        document.getElementById('resNegocio').innerText = tNegocio.toLocaleString();
    }

    // --- Funciones Sección 4 ---
    function eliminarRegistro(id) {
        registros = registros.filter(r => r.id !== id);
        guardarYActualizar();
    }

    function borrarTodo() {
        if(confirm("¿Seguro que quieres borrar todos los datos?")) {
            registros = [];
            contador = 0;
            localStorage.clear();
            actualizarVista();
        }
    }

    function toggleHistorial() {
        document.getElementById('listaRegistros').classList.toggle('hidden');
    }