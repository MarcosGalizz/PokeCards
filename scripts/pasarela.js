import { actualizarIconoCarrito, carrito } from "./carrito.js";
const precio = document.getElementById("pasarela-precio");
const total = Number(localStorage.getItem("total"));
const impuestos = .21;
const totalFinal = total + (total*impuestos);
const contenido = document.getElementById("main-pasarela");

document.addEventListener("DOMContentLoaded", (e)=>{
    actualizarIconoCarrito();
    precio.textContent = "$" + totalFinal;
});

const formPasarela = document.getElementById("form-pasarela");

formPasarela.addEventListener("submit", (e)=>{
    e.preventDefault();
    // Animación de carga
    cargar();
    // Borro el carrito
    localStorage.removeItem("carrito");
    window.location.href = "./confirmacionCompra.html";
});

function cargar(){
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
}


const formulario = document.getElementById("form-search");
const pokemonBuscado = document.getElementById("form-input");

formulario.addEventListener("submit", (e) => {
    // preventDefault evita el comportamiento por defecto del formulario (recargar o cambiar de página),
    e.preventDefault();

    // Se obtiene el valor ingresado, se eliminan espacios innecesarios y se pasa a minúsculas 
    // para buscar al Pokémon.
    const nombre = pokemonBuscado.value.trim().toLowerCase();

    // Si el usuario no ingresó nada, se muestra un mensaje de error.
    if (!nombre) {
        mostrarErrores("Ingrese el nombre de un Pokémon");
        return
    }
    
    // Se guarda el nombre en localStorage, lo que permite que otra página (por ejemplo, "pokemon.html")
    // pueda recuperar este valor sin necesidad de pasar datos por la URL.
    localStorage.setItem("producto", nombre);
    window.location = "./producto.html"
    // Finalmente, se redirige al usuario a la página donde se mostrará la información del Pokémon buscado.
    
});