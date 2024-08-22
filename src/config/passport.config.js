import passport, { Passport } from "passport";
import local from "passport-local";
import github from "passport-github2";

import { generaHash } from "../utils.js";
import { UsuariosMongoDAO as DAO } from "../dao/UsuariosMongoDAO.js";
import { config } from "./config.js";

const usuariosManager = new DAO();

export const initPassport = () => { 
    passport.use(
        "registro",
        new local.Strategy( 
            { 
                usernameField: "email", 
                passReqToCallback: true 
            }, 
            async (req, username, password, done) => {
                try { 
                    let { nombre } = req.body 
                    if (!nombre) {
                        return done(null, false);
                    }

                    let existe = await usuariosManager.getBy({ email: username })
                    if (existe) {
                        return done(null, false)
                    }

                    password = generaHash(password)

                    let nuevoUsuario = await usuariosManager.create({ nombre, email:username, password, rol: "user"})
                    return done(null, nuevoUsuario);

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usenameFile: "email"
            },
            async (username, password, done) => {
                try {
                    let usuario = await usuariosManager.getBy({ email:username });
                    
                    if (!usuario) {
                        return done(null, false);
                    }

                    if (!validaPassword(password, usuario.password)) {
                        return done(null, false);
                    }

                    return done(null, usuario);
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
    "github",
    new github.Strategy(
        {
            clientID:"Iv23liF3iV6vFDAFAFA8", 
            clientSecret:"e4ba35c0eb298cb4ea3d4f934ed3c64e2468f851",
            callbackURL:""
        },
        async(tokenAcceso, tokenRefresh, profile, done)=>{
            try {
                let email = profile._json.email;
                let nombre = profile._json.name;
                let usuario = await usuariosManager.getBy({email});
                if(!usuario){
                    usuario = await usuariosManager.create({
                        nombre, email, profile
                    })
                }

                return done(null, usuario);
            } catch (error) {
                
            }
        }
    )
    )

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    }) 

    passport.deserializeUser(async (id, done) => {
        let usuario = await usuariosManager.getBy({ _id: id })
        return done(null, usuario)
    })

}