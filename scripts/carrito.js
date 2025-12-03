// Exportamos las funciones relacionadas al carrito
export let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
// Función para guardar el carrito
export function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para actualizar el número del ícono
export function actualizarIconoCarrito(){
    let total= 0;
    const icono = document.getElementById("numero-carrito");
    for (const item of carrito){
        total += item.cantidad;
    }
    icono.textContent = total;
}

// Función para agregar a un Pokemon al carrito
export function agregarAlCarrito(id, nombre, cantidadSeleccionada){
    const item = carrito.find(p => p.id === id);
    if (item){
        item.cantidad += cantidadSeleccionada;
    }
    else{
        carrito.push({id, nombre, cantidad: cantidadSeleccionada})
    }
    guardarCarrito();
    actualizarIconoCarrito();
}

// Función para obtener la cantidad de un producto al que agrego al carrito.
export function obtenerCantidad(boton, producto){
    const contenedor = boton.closest(producto);
    const select = contenedor.querySelector(".cantidad-producto");
    return Number(select.value);
}

const formulario = document.getElementById("form-search");
const pokemonBuscado = document.getElementById("form-input");

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = pokemonBuscado.value.trim().toLowerCase();
    if (!nombre) {
        mostrarErrores("Ingrese el nombre de un Pokémon");
        return
    }
    localStorage.setItem("producto", nombre);
    window.location = "./producto.html"
});
