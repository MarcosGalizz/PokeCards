import {actualizarIconoCarrito, agregarAlCarrito, obtenerCantidad} from "./carrito.js";

const contenido = document.querySelector(".producto-container");
const producto = localStorage.getItem("producto");

document.addEventListener("DOMContentLoaded", (e) => {
    // Mostrar la cantidad de elementos en el carrito
    actualizarIconoCarrito();
    // Si no se encontró ningún nombre en localStorage, se muestra un error.
    if (!producto) {
        mostrarErrores("No se encontró el pokemon ingresado.");
        return
    }

    // Se muestra una animación de carga con una pokebola SVG mientras se espera la respuesta de la API.
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

    // Se realiza una petición HTTP a la PokeAPI para obtener los datos del Pokémon guardado.
    fetch(`https://pokeapi.co/api/v2/pokemon/${producto}`)
        // Verificamos que la respuesta sea válida. Si no, lanzamos un error manual.
        .then(res => {
            if (!res.ok) {
                throw new Error("Pokémon no encontrado.");
            }
            return res.json(); // Convertimos la respuesta a formato JSON.
        })
        // Si la respuesta fue exitosa, se pasa el objeto de datos al renderizador principal.
        .then(data => mostrarPokemon(data))
        // Si hubo algún error en la búsqueda o conexión, se muestra en pantalla.
        .catch(error => mostrarErrores(error));
});


function mostrarPokemon(pokemon) {
    // Actualiza el título del documento con el nombre del Pokémon.
    document.title = `${(pokemon.name).toUpperCase()}`;
    const precio = pokemon.base_experience * 2;
    // URL de la imagen del Pokémon.
    const imagenPokemon = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`;

    // Construcción del contenido HTML principal con la información del Pokémon.
    contenido.innerHTML = `
        <section id="producto">
            <div class="img-container">
                <img src="${imagenPokemon}" alt="Pokemon">
            </div>
            <div class="data-prod-container">
                <h3 class="nombre">${(pokemon.name).toUpperCase()}</h3>
                <p class="info-item">
                    <strong>🔍 Tipo:</strong> 
                    ${pokemon.types.map(t => `
                        <span class="tipo" data-tipo="${t.type.name}">
                            ${t.type.name}
                        </span>
                    `).join(", ")}
                </p>
                ${generarStatsBase(pokemon)}
                <p class="info-item"><strong>⚖️ Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p class="info-item"><strong>↕️ Altura:</strong> ${pokemon.height / 10} m</p>
                <p class="info-item">
                    <strong>🎯 Habilidades:</strong>${pokemon.abilities.map(t => t.ability.name).join(", ")}
                </p>
                <p class="info-item"><strong>✨ Experiencia Base:</strong> ${pokemon.base_experience}</p>
            </div>
        </section>
        <section id="venta">
            <p class="precio">Precio: <span class="producto-precio">$${precio}</span></p>
            <div class="btn-container">
                <select name="Cantidad" class="cantidad-producto">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <button class="btn-carrito" data-id="${pokemon.id}" data-nombre="${pokemon.name}">Agregar al carrito</button>
            </div>
        </section>
           
    `;
    contenido.style.backgroundColor = "#F0F0F0";
}


// Se obtienen las referencias a los elementos del formulario.
const pokemonBuscado = document.getElementById("form-input");
const formulario = document.getElementById("form-search");


formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = pokemonBuscado.value.trim().toLowerCase();
    // Si el usuario no ingresó nada, sale error
    if (!nombre) {
        mostrarErrores("Ingrese el nombre de un Pokémon");
        return
    }
    localStorage.setItem("producto", nombre);
    window.location = "./producto.html"
});

function mostrarErrores(error){
    alert(error);
}

// Función que recibe el nombre de un Pokemon y devuelve varias estadísticas
function generarStatsBase(pokemon) {
    return pokemon.stats.map(stat => {
        const nombre = stat.stat.name
            .replace("special-attack", "🎆Ataque Especial")
            .replace("special-defense", "🚫Defensa Especial")
            .replace("hp", "❤️HP")
            .replace("attack", "⚔️Ataque")
            .replace("defense", "🛡️Defensa")
            .replace("speed", "🏃‍➡️Velocidad");

        return `
            <p class="info-item">
                <strong>${nombre}:</strong> ${stat.base_stat}
            </p>
        `;
    }).join("");
}

// Evento para agregar el producto al carrito
document.addEventListener("click", (e) =>{
    if(e.target.matches(".btn-carrito")){
        const id = Number(e.target.dataset.id);
        const nombre = e.target.dataset.nombre;
        const cantidad = obtenerCantidad(e.target, ".producto-container");
        agregarAlCarrito(id, nombre, cantidad);
        e.target.textContent = "Producto Agregado✅";
    }
})