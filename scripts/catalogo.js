import {actualizarIconoCarrito, agregarAlCarrito, obtenerCantidad} from "./carrito.js";

const inputBusqueda = document.getElementById("form-input");
const cantidad = 10;
let cantidadPokemon = 0;

document.addEventListener("click", (e) => {
    // --- 1) CLICK EN EL BOTÓN DE AGREGAR ---
    if(e.target.closest(".btn-carrito")){
        const id = Number(e.target.dataset.id);
        const nombre = e.target.dataset.nombre;
        const cantidad = obtenerCantidad(e.target, ".producto");
        agregarAlCarrito(id, nombre, cantidad);
        e.target.textContent = "Producto Agregado✅";
    }
    // --- 2) CLICK EN EL BOTÓN DE BÚSQUEDA ---
    if (e.target.closest("#btn-buscar")) {
        e.preventDefault();

        const nombre = inputBusqueda.value.trim().toLowerCase();

        if (!nombre) {
            mostrarErrores("Ingrese el nombre de un Pokémon.");
            return;
        }

        localStorage.setItem("producto", nombre);
        window.location.href = "vistas/producto.html";
        return;
    }

    // --- 3) CLICK EN EL BOTÓN DE 'CARGAR MÁS' ---
    if (e.target.matches("#cargarMas")){
        e.target.remove();
        cargarPokemon();
    }

    // --- 4) CLICK EN UN PRODUCTO SOLO SI FUE EN EL <a> ---
    const link = e.target.closest("a");

    const producto = link.closest(".producto");
    const nombreEl = producto.querySelector(".nombre");
    const nombre = nombreEl.textContent.trim().toLowerCase();

    localStorage.setItem("producto", nombre);
    window.location.href = "vistas/producto.html";

});


function mostrarErrores(error) {
    contenido.innerHTML = `<p>${error}</p>`
}

// --- Genera 10 números aleatorios de Pokémon (1 al 1025) ---
function generarDiezPokemon() {
    const maxPokemon = 1025; // Puedes actualizar este número si agregan más
    const lista = [];

    while (lista.length < cantidad) {
        const random = Math.floor(Math.random() * maxPokemon) + 1;
        if (!lista.includes(random)) {
            lista.push(random);
        }
    }

    return lista;
}

const contenido = document.getElementById("productos");

document.addEventListener("DOMContentLoaded", (e) =>{
    // Siempre que se recargue la pagina, se muestra la cantidad de elementos en el carrito
    actualizarIconoCarrito();
    contenido.innerHTML = `
        <div id="loading-pokeball">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pokeball">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M3 12h6" />
                <path d="M15 12h6" />
            </svg>
        </div>
    `;
    contenido.innerHTML = "";
    cargarPokemon();
    
    
    // Se realiza una petición HTTP a la PokeAPI para obtener los datos del Pokémon guardado.
})

function mostrarPokemon(pokemon){
    // Actualiza el título del documento con el nombre del Pokémon.
    
    const precio = pokemon.base_experience * 2;
    // URL de la imagen del Pokémon.
    const imagenPokemon = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`;

    // Construcción del contenido HTML principal con la información del Pokémon.
    contenido.innerHTML += `
        <article class="producto">
            <a href="vistas/producto.html">
                <div class="data-container">
                    <div class="img-container">
                        <img src="${imagenPokemon}" alt="Pokemon">
                    </div>
                    <h3 class="nombre">${(pokemon.name).toUpperCase()}</h3>
                    <p class="precio">$${precio}</p>
                </div>
            </a>
            <div class="btn-container">
                <select name="Cantidad" class="cantidad-producto">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <button class="btn-carrito" data-id="${pokemon.id}" data-nombre="${pokemon.name}">Agregar al carrito</button>
            </div>
        </article>
    `;
}

function cargarPokemon(){
    cantidadPokemon = 0;
    const listaPokemon = generarDiezPokemon();
    for (const pokemon of listaPokemon){
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            // Verificamos que la respuesta sea válida. Si no, lanzamos un error manual.
            .then(res => {
                if (!res.ok) {
                    throw new Error("Pokémon no encontrado.");
                }
                return res.json(); // Convertimos la respuesta a formato JSON.
            })
            // Si la respuesta fue exitosa, se pasa el objeto de datos al renderizador principal.
            .then(data => {mostrarPokemon(data); cantidadPokemon++; if(cantidadPokemon === cantidad) mostrarMasPokemon()})
            // Si hubo algún error en la búsqueda o conexión, se muestra en pantalla.
            .catch(error => mostrarErrores(error));

    }
}

function mostrarMasPokemon(){
    contenido.innerHTML += `
        <button id="cargarMas">Cargar más</button>
    `;
}



