import { carrito, guardarCarrito } from "./carrito.js";

const totalProductos = document.getElementById("carrito-prod");
const contenido = document.getElementById("carrito");
let total = 0;

// ------------------- CARGAR CARRITO -------------------
document.addEventListener("DOMContentLoaded", () => {
    // Verificar si el carrito tiene productos, sino desacrtivar el botón para continuar
    desactivar();
    contenido.innerHTML = "";

    for (const pokemon of carrito) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.nombre}`)
            .then(res => {
                if (!res.ok) throw new Error("Pokémon no encontrado.");
                return res.json();
            })
            .then(data => mostrarPokemon(data, pokemon))
            .catch(error => mostrarErrores(error));
    }

});

// ------------------- MOSTRAR PRODUCTO -------------------
function mostrarPokemon(pokemon, extra) {
    const precio = pokemon.base_experience * 2;
    const imagenPokemon = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`;
    const nombreLower = pokemon.name.toLowerCase();

    contenido.innerHTML += `
        <article class="producto-carrito" data-nombre="${nombreLower}" data-precio="${precio}">
            <a href="producto.html">
                <div class="product-container">
                    <div class="img-container">
                        <img src="${imagenPokemon}" alt="Imagen ${pokemon.name}">
                    </div>
                    <div>
                        <h3 class="nombre">${pokemon.name.toUpperCase()}</h3>
                        <p class="precio">$${precio}</p>
                    </div>
                </div>
            </a>

            <div class="btn-container">
                <select class="cantidad-producto">
                    <option value="1" ${extra.cantidad == 1 ? "selected" : ""}>1</option>
                    <option value="2" ${extra.cantidad == 2 ? "selected" : ""}>2</option>
                    <option value="3" ${extra.cantidad == 3 ? "selected" : ""}>3</option>
                    <option value="4" ${extra.cantidad == 4 ? "selected" : ""}>4</option>
                </select>

                <button class="btn-eliminar">Eliminar</button>
            </div>
        </article>
    `;

    // Actualizar los totales
    recalcularTotales();
}

// ------------------- MOSTRAR ERRORES -------------------
function mostrarErrores(error) {
    contenido.innerHTML = `<p>${error}</p>`;
}

// ------------------- CLICK EN PRODUCTOS -------------------
document.addEventListener("click", (e) => {
    // ---------- 1) Ir a producto ----------
    const link = e.target.closest("a");
    if (link) {
        const producto = link.closest(".producto-carrito");
        if (!producto) return;
        const nombre = producto.dataset.nombre.toLowerCase();
        localStorage.setItem("producto", nombre);
        window.location.href = "vistas/producto.html";
        return;
    }

    // ---------- 2) Eliminar producto ----------
    if (e.target.matches(".btn-eliminar")) {
        const producto = e.target.closest(".producto-carrito");
        if (!producto) return;
        const nombre = producto.dataset.nombre.toLowerCase();

        // Eliminar del carrito
        const index = carrito.findIndex(p => p.nombre === nombre);
        if (index !== -1) carrito.splice(index, 1);

        guardarCarrito();

        // Eliminar del DOM
        producto.remove();
        recalcularTotales();
    }

    if(e.target.matches("#continuar")){
        window.location.href = "../vistas/pasarela-de-pago.html";
    }

    if(e.target.matches("#vaciar-carrito")){
        let confirmacion = confirm("¿Seguro que desea vaciar el carrito?")
        if(confirmacion){
            // Vaciar el carrito
            carrito.length = 0;
            guardarCarrito();
            contenido.innerHTML = ""
            recalcularTotales();
        }
    }
});

// ------------------- CAMBIAR CANTIDAD -------------------
document.addEventListener("change", (e) => {
    if (e.target.matches(".cantidad-producto")) {
        // Buscar el producto que cambió de cantidad
        const producto = e.target.closest(".producto-carrito");
        if (!producto) return;
        const nombre = producto.dataset.nombre.toLowerCase();
        const nuevaCantidad = Number(e.target.value);

        const item = carrito.find(p => p.nombre === nombre);
        if (!item) return;
        // Cargar la nueva cantidad
        item.cantidad = nuevaCantidad;

        guardarCarrito();
        recalcularTotales();
    }
});

// ------------------- RECALCULAR TOTALES -------------------
function recalcularTotales() {
    let cantidadTotal = 0;
    total = 0;

    carrito.forEach(item => {
        cantidadTotal += item.cantidad;
        // Buscar por el DOM los productos para calcular el total
        const producto = document.querySelector(`[data-nombre="${item.nombre}"]`);

        let precioReal = 0;
        if (producto) {
            precioReal = Number(producto.dataset.precio) || 0;
        } else {
            precioReal = 0;
        }

        total += item.cantidad * precioReal;
    });

    totalProductos.textContent = cantidadTotal;
    desactivar();
    document.getElementById("carrito-total").textContent = "$" + total;
    // Guardar el total para la siguiente página
    localStorage.setItem("total", total);
}

function desactivar(){
    if (carrito.length === 0){
        document.getElementById("continuar").disabled = true;
    }
    else{
        document.getElementById("continuar").disabled = false;
    }
}