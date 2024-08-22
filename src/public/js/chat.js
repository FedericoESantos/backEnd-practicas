Swal.fire({ 
    title:"Identifíquese",
    input:"text",
    text:"Ingrese su email",
    inputValidator:(value) =>{
        return !value && "Debe ingresar un nombre !!!"
    },
    allowOutsideClick: false
}).then(datos=>{ 
    let nombre = datos.value;
    document.title = nombre; 
    
    let inputMensaje = document.getElementById("mensaje"); 
    let divMensajes = document.getElementById("mensajes"); 
    inputMensaje.focus(); 

    const socket= io(); 

    socket.emit("id", nombre);

    socket.on("nuevoUsuario", nombre=>{ 
        Swal.fire({ 
            text: `${nombre} se ha conectado !!!`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("mensajesPrevios", mensajes=>{
        mensajes.forEach(mens => {
            divMensajes.innerHTML+= `<span class="mensaje"><strong>${mens.nombre}</strong> dice: <i>${mens.mensaje}</i></span><br>`;
            divMensajes.scrollTop = divMensajes.scrollHeight;
        });
    })

    socket.on("saleUsuario", nombre=>{
        console.log(nombre)
        divMensajes.innerHTML+= `<span class="mensaje"><strong>${nombre}</strong> ha salido del chat... :(</span><br>`;
    })

    inputMensaje.addEventListener("keyup", event=>{
        event.preventDefault(); 

        if(event.code==='Enter' && event.target.value.trim().length > 0){ 
        
            socket.emit("mensaje", nombre, event.target.value.trim()); 
        
            event.target.value = " "; 
            event.target.focus(); 
        }  
    })

    socket.on("nuevoMensaje", (nombre, mensaje)=>{ 
        divMensajes.innerHTML+= `<span class="mensaje"><strong>${nombre}</strong> dice: <i>${mensaje}</i></span><br>` 
        divMensajes.scrollTop = divMensajes.scrollHeight; 
    });

    }) 


