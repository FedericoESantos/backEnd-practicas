import express from "express";
import cors from "cors";
import path from "path";
import { Server } from "socket.io"; 
import { engine } from "express-handlebars"; 
import mongoose from "mongoose";
import __dirname, { loggerDesarrollo, middLogger } from "./utils.js"; 
import sessions from "express-session"; 
import passport from "passport"
import { initPassport } from "./config/passport.config.js";
import { config } from './config/config.js';
import nodemailer from "nodemailer";

import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import { router as sessionRouter } from "./routes/session.router.js";
import { router as usuariosRouter } from "./routes/usuarios.router.js";
import { router as mockingprod } from "./routes/mockingProducts.route.js";

import messageModel from "./dao/models/messagesModel.js"; 
import MongoStore from "connect-mongo";
import { auth } from "./middleware/auth.js";
import { usuarioModel } from "./dao/models/usuarioModels.js";
import { UsuariosDTO } from "./dto/UsuariosDTO.js";
import { ConnDB } from "./config/ConnDB.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import cluster from "cluster";

if (cluster.isPrimary) {
    cluster.fork();
    cluster.fork();
    cluster.fork();
}
else {
    const app = express();
    const PORT = config.PORT;

    const transporter = nodemailer.createTransport( 
        {
            service: "gmail",
            port: "587", 
            auth: {
                user: "boomarts47@gmail.com",
                pass: "kvbgjskjbcgnrpro"
            }
        }
    )

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname + "/public"));

    const option ={
        definition:{
            openapi:"3.0.0",
            info:{
                title:"Api Productos y Carrito",
                version: "1.0.0",
                description: "Documentacion del endpoint de Productos y de Carrito"
            },
        },
        apis: [ "./src/*.yaml" ]
    }

    const specific = swaggerJSDoc(option)
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specific));

    app.use(cors());
    app.use(middLogger);

    app.use(sessions({
        secret: "CoderCoder123",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            ttl: 3600, 
            mongoUrl: "mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce"
        })
    }))

    initPassport();
    app.use(passport.initialize());
    app.use(passport.session()); 

    app.engine("handlebars", engine());
    app.set("views", path.join(__dirname + "/views")); 
    app.set("view engine", "handlebars");

    app.use("/api/products", productsRoute);
    app.use("/api/carts", cartsRoute);
    app.use("/api/sessions", sessionRouter);
    app.use("/api/users", usuariosRouter);
    app.use("/", viewsRoute);
    app.use("/mockingproducts", mockingprod);
    app.use("/users", async (req, res) => {
        let usuarios = await usuarioModel.find().lean();
        
        usuarios = usuarios.map(us => new UsuariosDTO(us));

        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ payload: usuarios });
    })

    app.get("/datos", auth, (req, res) => { 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            datos: "datos", sesson: req.session
        });

    })

    app.get("/session", (req, res) => { 
        if (req.session.contador) { 
            req.session.contador++ 
        } else { 
            req.session.contador = 1; 
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(`visitas al site: ${req.session.contador}`); 
    })

    app.get("/getcookies", (req, res) => { 
        let cookies = req.cookies; 
        let cookiesFirmadas = req.signedCookies; 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            cookies, 
            cookiesFirmadas 
        });

    })

    let usuarios = []; 

    const HTTPServer = app.listen(PORT, () => { console.log(`Corriendo aplicacion en el puerto ${PORT}`); });
    const io = new Server(HTTPServer); 

    io.on("connection", (socket) => { 
        loggerDesarrollo.info("Se ha conectado un cliente");

        socket.on("agregarProducto", async () => {
            
            let nuevoProducto = await productManager.createProduct({ title, description, code, price, stock, category });
            productos.push(nuevoProducto);
            res.status(201).json(nuevoProducto);
        })
        
        socket.on("id", async (nombre) => { 
            usuarios.push({ id: socket.id, nombre }); 

            let mensajes = await messageModel.find(); 
            mensajes = mensajes.map(men => { 
                return { nombre: men.email, mensaje: men.mensaje }
            })
            socket.emit("mensajesPrevios", mensajes); 
            socket.broadcast.emit("nuevoUsuario", nombre); 
        })

        socket.on("mensaje", async (nombre, mensaje) => { 
            await messageModel.create({ email: nombre, mensaje }) 
            io.emit("nuevoMensaje", nombre, mensaje); 
        })

        socket.on("disconnect", () => {
            let usuario = usuarios.find(usur => usur.id === socket.id);   
            if (usuario) { 
                io.emit("saleUsuario", usuario.nombre); 
                loggerDesarrollo(usuario.nombre);
            }
        })

    })
    
    ConnDB.conectar("mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "ecommerce");
    
    transporter.sendMail( 
        {
            from: "E-commerce boomarts47@gmail.com",
            to: "boomarts@yahoo.com", 
            subject: "prueba de mail con adjunto",
            
            html:`<h2>Mensaje de prueba</h2>
            <p>mensajes con adjuntos</p>
            <br>
            <hr>
            <img src="imagen1"/>
            <hr>
            `,
            attachments: [ 
                {
                    path:"./src/public/img/fondo.jpg",
                    filename:"logo",
                    cid: "imagen1" 
                },
            ] 
        }
    ).then(console.log("Mail enviado")) 
    .catch(error=>console.log(error)) 

    const enviarEmail = async(de,para, asunto, mensaje, adjuntos)=>{
        return await transporter.sendMail(
            {
                from: de,
                to: para,
                subject: asunto,
                html: mensaje,
                attachments: adjuntos
            }
        )
    }
    
    let resultado = await enviarEmail(
        "E-Commerce boomarts47@gmail.com", 
        "boomarts@yahoo.com", 
        "prueba de mail con adjunto", 
        `<h2>Mensaje de prueba</h2> 
            <p>mensajes con adjuntos</p>
            <br>
            <hr>` 
       )
    
    if(resultado.accepted.length>0){
        console.log('Mail Enviado!!!');
    }
}
