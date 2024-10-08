import { generaHash, validaPassword } from "../utils.js";
import Router from 'express';
import { UsuariosMongoDAO as DAO } from "../dao/UsuariosMongoDAO.js";
import passport from "passport"

export const router = Router();
const usuariosManager = new DAO();

router.get("/error", (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
    {
    error:`Error inesperado en el servidor - Intente más tarde`,
    detalle: `Fallo al auntenticar`
    }
    )
})

router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async(req,res)=>{

res.setHeader('Content-Type', 'application/json');
return res.status(200).json({mensaje: "registro: Ok}", nuevoUsuario:req.user });

})


router.post("/login", passport.authenticate("login", {failureRedirect:"/api/session-error"} ),async(req,res)=>{
    let { web } = req.body;
    console.log(req.body);

    let usuario = { ... req.user};
    delete usuario.password;
    req.session.usuario = usuario;

    if(web){
        res.redirect("/perfil");
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({
            payload: "Login correcto :D",
            usuario
        });
    }

})

router.get("/github", passport.authenticate("github", {}), (req,res)=>{

})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}) ,(req,res)=>{
    
    req.session.usuario = req.user;
    
    res.setHeader('Content-Type', 'application/json');
   return res.status(200).json({payload:req.user});
})

router.get("/logout", (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.log(error)
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
            {
            error:`Error inesperado en el servidor - Intente más tarde`,
            detalle: `${error.message}`
            }
            )
        }
    })
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({payload: `LogOut Existoso!!!`});
})