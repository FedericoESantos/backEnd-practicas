const socket = io; 

socket.on("productos", productos =>{
    const tbody = document.getElementById("productos-tbody");
    const prod = productos.productos;

    tbody.innerHTML = `
        <td>${prod.title}</td>
        <td>${prod.description}</td>
        <td>${prod.code}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td>${prod.category}/td>
    `;
}); 

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function(e){ 
    e.preventDefault(); 

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    const producto = {
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category
    }

    socket.emit("agregarProducto", producto);
    
    formulario.requestFullscreen(); 
})
