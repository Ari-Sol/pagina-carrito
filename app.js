// Selecciona el encabezado y el contenedor principal (si existe)
const header = document.querySelector("#header");
const contenedor = document.querySelector("#contenedor");
const body = document.querySelector("body");

// Cambia el estilo del encabezado al hacer scroll
window.addEventListener("scroll", function () {
    if (contenedor && contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll"); // Agrega fondo y sombra al header
    } else {
        header.classList.remove("scroll"); // Quita el fondo si está en la parte superior
    }
});

// Menú desplegable: abrir/cerrar al hacer clic
const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu-desplegable');

if (btnMenu && menu) {
    btnMenu.addEventListener('click', () => {
        menu.classList.toggle('mostrar');
    });

    window.addEventListener('click', function (e) {
        if (!btnMenu.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('mostrar');
        }
    });
}

// ========== AGREGAR PRODUCTOS AL CARRITO ==========

// Este bloque se ejecuta en páginas con productos (como rubyrose.html o index.html)
document.querySelectorAll(".informacion button").forEach((boton) => {
    boton.addEventListener("click", () => {
        // Busca los datos del producto desde su contenedor
        const contenedorProducto = boton.closest("div").parentElement;
        const nombre = contenedorProducto.querySelector(".informacion p:first-child").textContent;
        const precio = contenedorProducto.querySelector(".precio").textContent;
        const imagen = contenedorProducto.querySelector("img").getAttribute("src");

        // Crea un objeto producto
        const producto = { nombre, precio, imagen };

        // Recupera el carrito desde localStorage, o crea uno nuevo
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Agrega el nuevo producto al carrito
        carrito.push(producto);

        // Guarda el carrito actualizado en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));

        // Alerta de confirmación
        alert(`${nombre} se agregó al carrito`);
    });
});

// MOSTRAR CARRITO DE COMPRAS 

// Este bloque solo se ejecuta en carrito.html
document.addEventListener("DOMContentLoaded", () => {
    const carritoContenedor = document.getElementById("carrito-contenido");
    const totalDiv = document.getElementById("total");
    const btnVaciar = document.getElementById("vaciar-carrito");

    // Si no existe el contenedor del carrito, no hacer nada
    if (!carritoContenedor) return;

    // carga los productos desde localStorage y los muestra
    function cargarCarrito() {
        carritoContenedor.innerHTML = ""; // Limpia el contenido anterior
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Si el carrito está vacío, muestra un mensaje
        if (carrito.length === 0) {
            carritoContenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
            totalDiv.textContent = "";
            return;
        }

        let total = 0;

        // Recorre cada producto del carrito
        carrito.forEach((producto, index) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="informacion">
                    <p>${producto.nombre}</p>
                    <p class="precio">${producto.precio}</p>
                    <button data-index="${index}" class="eliminar-btn">Eliminar</button>
                </div>
            `;
            carritoContenedor.appendChild(div);

            // Suma el precio del producto al total (extrayendo solo los números)
            const precioNumerico = parseFloat(producto.precio.replace(/[^0-9.]/g, '').replace(',', '.'));
            total += precioNumerico;
        });

        // Muestra el total a pagar con 3 cifras decimales
        totalDiv.textContent = `Total a pagar: $${total.toLocaleString("es-CO", { minimumFractionDigits: 3 })}`;

        // Asigna funcionalidad a los botones "Eliminar"
        asignarBotonesEliminar();
    }

    // Elimina un producto del carrito según su índice
    function asignarBotonesEliminar() {
        const botonesEliminar = document.querySelectorAll(".eliminar-btn");
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", () => {
                const index = boton.getAttribute("data-index");
                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                carrito.splice(index, 1); // Elimina el producto
                localStorage.setItem("carrito", JSON.stringify(carrito));
                cargarCarrito(); // Recarga el carrito actualizado
            });
        });
    }

    // Botón para vaciar todo el carrito
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            localStorage.removeItem("carrito");
            cargarCarrito();
        });
    }

    // Carga el carrito al abrir la página
    cargarCarrito();
});
