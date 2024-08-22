import { usuariosService } from "../repository/usuarios.service.js";

async function getUsers(req,res){
    try {
        let usuarios = await usuariosService.getUsuarios();
        
        return res.status(200).json({
            usuarios
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })        
    }
}

async function getUserById(req,res){
    try {
        let usuarios = await usuariosService.getUserById(req.params.id);
        
        return res.status(200).json({
            usuarios
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })  
    }
}

async function getUserByEmail(req,res){
    try {
        let usuarios = await usuariosService.getUserByEmail(req.params.email);
        
        return res.status(200).json({
            usuarios
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })  
    }
}

async function postUser(req,res){
    
    let { nombre, email } = req.body;
    if(!nombre || !email) 
        return res.status(400).json({error:"Complete todos los datos"});
    
    try {
        let existe = await usuariosService.getUserByEmail(email);
        if(existe)
            return res.status(400).json({error:`usuario con email ${email} ya existen`});

        let nuevoUsuario = await usuariosService.createUser(nombre, email);
        return res.status(201).json({nuevoUsuario});
        
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })  
    }
}

async function postUserDocuments(req,res){
    // aca va el middleware de multer
    // para poder recibir documentos que se carguen
    // y actualizar en el usuario su status para hacer saber que 
    // se subio algun doc en particular





}

async function putUserPremium(req,res){
    

}

export default {getUsers, postUser, getUserById, getUserByEmail, postUserDocuments, putUserPremium};