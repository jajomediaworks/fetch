const contenedorProductos= document.getElementById("contenedor-productos"); 

const contenedorCarrito = document.getElementById("carrito-contenedor");

const botonVaciar = document.getElementById("vaciar-carrito");

const countCart = document.getElementById("countCart");

const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')
const stockProductos = []


let carrito = [] // variable de un array vacio para agregar los productos al carrito
// Despues del carrito agregamos localstorage, 
document.addEventListener('DOMContentLoaded', () => { //una vez que este cargado el documento agregamos el localstorage
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        document.getElementById("countCart").classList.remove ("d-none");
        actualizarCarrito();
    }
})

botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    countCart.innerText = carrito.length; // Borrar opcional
    precioTotal.innerText = carrito.length = 0;
    document.getElementById("countCart").classList.add ("d-none")
    actualizarCarrito();
})

    fetch("./data.json")
    .then(response => response.json())
    .then( datos => {
        datos.forEach( producto => {
            stockProductos.push( producto );
        })
        stockProductos.forEach((producto) => {
            const div = document.createElement('div');
            div.classList.add('col-md-4')
            div.innerHTML = `
            <div class="box-body">
                <div class="card mb-3">
                    <img src="${producto.img}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p><small>${producto.titulo}</small></p>
                      <p class="my-3"><small>$ ${producto.precio}</small></p>
                      <button id="agregar${producto.id}" class="btn-edit boton-agregar" type="button">Agregar <span class="material-icons-outlined">add_shopping_cart</span></button>
                    </div>
                </div>
              </div>`
          contenedorProductos.appendChild(div)
        
          const boton = document.getElementById(`agregar${producto.id}`) 
         
            boton.addEventListener('click', () => { // Agregamos un evento que ejecute la funtion agragarAlcarrito
                agregarAlcarrito(producto.id);
                document.getElementById("countCart").classList.remove ("d-none");
                Toastify({
                    text: `${producto.titulo} fue agregado al carrito $ ${producto.precio}`,
                    duration: 3000,
                    style: {
                      background: "#D58E02",
                      border: "1px solid #FFD90A",
                      color: "#000" 
                    },
                  }).showToast();
            })
        });
    })


/* const getContenedorProducto = async () => {
    try {

        let response = await fetch("https://jajomedia.com/data/data.json");
        let data = await response.json();
    
        let stockProductos = data.results;
    // recorremos el array con un foreach
    
        
    } catch (error) {
        const div = document.createElement('div');
        div.innerHTML = ` <div class="alert alert-primary" role="alert">Ha ocurriod un error, por favor intentar más tarde</div>`
        contenedorProductos.appendChild(div)
    }

}
getContenedorProducto(); */

// Funtion para agregar los productos al carrito - parametros agragamos el id del prodcuto

const agregarAlcarrito = (prodId) => {
    const existe = carrito.some (prod => prod.id === prodId) //comprobar si el elemento ya existe en el carro
    if (existe) { // iteramos un nuevo arreglo 
        const prod = carrito.map ( prod => { //.map va encontrar en curso que ya esta agregado y le va sumar la cantidad
            prod.id === prodId && prod.cantidad++;
            // if (prod.id === prodId){
            //         prod.cantidad++
            // }
        })
    }else{ // En caso de que la cantidad sea solo una se va agregar
        const item = stockProductos.find((prod) => prod.id === prodId);
        carrito.push(item); // una vezz hecho el push tenemos que seleccionar el boton agregar${producto.id}
    }

    actualizarCarrito(); 
}

// ELIMINAR EL CARRITO
const eliminarDelCarrito = (prodId) => { // Para eliminar el producto del carrito utilizamos el metodo find
    const item = carrito.find((prod) => prod.id === prodId) // Obtenemos el id del producto

    const indice = carrito.indexOf(item)
    
    carrito.splice(indice, 1) // recibe 2 parametros el indice (del elemento item) y la cantidad a elementos a borrar
    
    countCart.innerText = carrito.length; // BORRAR OPCIONAL
    // precioTotal.innerText = carrito.length;
    actualizarCarrito()
}
const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = "" // para que no se acomulen los productos en el carrito

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <div class="d-flex flex-column rounded border border-secondary p-2 mb-3">
            <div class="d-flex justify-content-between align-items-center border-bottom border-secondary p-2">
                <div>
                    <img class="rounded-circle" width="60" src="${prod.img}" alt="">
                </div>
                <div class="ps-3"><small>${prod.nombre}</div>
            </div>
            <div class="d-flex justify-content-between border-bottom border-secondary p-2">
                    <div>Cantidad:</div>
                    <div><b id="cantidad">${prod.cantidad}</b></div>
            </div>
            <div class="d-flex justify-content-between border-bottom border-secondary p-2">
                    <div>Precio</div>
                    <div><b>$ ${prod.precio}</b></div>
            </div>
            <div class="text-end py-2">
                <div>
                <a class="text-warning" href="#" onclick ="eliminarDelCarrito(${prod.id})"><span class="material-icons-round"> delete_forever</span></a>
                </div>
            </div>
        </div>`

        contenedorCarrito.appendChild(div)

        localStorage.setItem('carrito', JSON.stringify(carrito))

      })   // Una vez que haya carga todo hacemos el setitem
/*         localStorage.setItem('carrito', JSON.stringify('carrito'))
 */
        countCart.innerText = carrito.length;

        precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)

}

