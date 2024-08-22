import { Router } from 'express';
import { productModel } from '../dao/models/productModel.js';
import { ProductManager } from "../dao/ProductManagerDAO.js"
import { CartManager } from '../dao/CartManagerDAO.js';
import { auth } from '../middleware/auth.js'; 
import { loggerDesarrollo, loggerProduccion } from '../utils.js';

const productManager = new ProductManager();
const cartManager = new CartManager();

export const router = Router();

router.get("/productos", async (req, res) => {  
    let carrito = await cartManager.getOneBy();
    if (!carrito) {
        carrito = await cartManager.create();
    }


    let { pagina } = req.query;
    if (!pagina) pagina = 1;

    let { limit, sort } = req.query;
    if (limit | sort) {
        const productLimit = await productModel.find().limit(Number(limit));
        const productSort = await productManager.getSortProducts();
        return res.status(200).json({ productLimit, productSort });
    }

    let productos;
    try {
        let { docs: prod, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getAllPaginate(1)

        productos = await productManager.getAll();
        res.setHeader('Content-Type', 'text/html');
        return res.render("productos", {
            productos, carrito, prod, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage,
            title: "Home Page",
            usuario: req.session.usuario
        });
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
})

router.get("/", async (req, res) => {  
    const productos = await productModel.find().lean();
    res.setHeader('Content-Type', 'text/html');
    return res.render("home", { productos, title: "Home Page" });
})

router.get("/registro", (req, res) => { 

    res.setHeader('Content-Type', 'text/html');
    return res.render("registro", { title: "Registro" });
})

router.get("/login",(req, res) => {  

    res.setHeader('Content-Type', 'text/html');
    return res.render("login", { title: "Login" });
})

router.get("/perfil", auth, (req, res) => {  
    
    res.render("perfil", {
        title: "My Perfil",
        usuario: req.session.usuario
    })
})

router.get("/realTimeProducts", async (req, res) => { 
    const productos = await productModel.find().lean(); 
    res.setHeader('Content-Type', 'text/html');
    return res.render("RealTimeProducts", { productos, title: "Real Time Products" });
});

router.get('/chat', (req, res) => { 
    res.setHeader('Content-Type', 'text/html');
    return res.render('chat', { title: "Chat" });
});

router.get("/loggerTest", (req, res) => {

    loggerDesarrollo.debug("Debug");
    loggerDesarrollo.http("Http");
    loggerDesarrollo.info("Info");
    loggerDesarrollo.warning("Warning");
    loggerDesarrollo.error("Error");
    loggerDesarrollo.fatal("Fatal");

    loggerProduccion.info("Info");
    loggerProduccion.warning("Warning");
    loggerProduccion.error("Error");

    res.setHeader(`Content-Type`, `text/html`);
    return res.status(200).json({});

});

export default router;