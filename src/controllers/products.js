import { request, response } from "express"; 

import { isValidObjectId } from 'mongoose';
import { ProductManager } from "../dao/ProductManagerDAO.js";

import { errorMessages } from "../middleware/diccionarioErrors.js";
import { CustomError, DatabaseError, NotFoundError, ValidationError } from "../middleware/customErrors.js";



const productManager = new ProductManager();
const req = request;

export const getProducts = async (req, res) => {

    try {
        let productos = await productManager.getAll();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productos });
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
}

export const getProductById = async (req, res, next) => {
    let { id } = req.params;
    if (!isValidObjectId(id)) { 
        return next(new ValidationError(errorMessages.PRODUCT_PRICE_INVALID));
    }
    try {
        let producto = await productManager.getProductBy({ _id: id });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
}

export const addProduct = async (req, res, next) => {
    let { description, code, price, stock } = req.body;
    if (!description || !code || !price) {
        return next(new ValidationError(errorMessages.PRODUCT_NAME_REQUIRED));
    }

    let existe = await productManager.getProductBy({ code })
    if (existe) {
        res.setHeader(`Content-Type`, `application/json`);
        return res.status(400).json({ error: `Ya existen productos con codigo ${code}` });
    }

    try {
        let nuevoProducto = await productManager.createProduct({description, code, price }); 
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ nuevoProducto });
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
}

export const deleteProduct = async (req, res) => {
    let { id } = req.params;
    try {
        let resultado = await productManager.deleteProduct(id);
        if (resultado) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ resultado });
        }
    } catch (error) {
        throw new Error(error);
    }
}

export const updateProduct = async (req, res) => {
    try {
        let { pid } = req.params;
        let { id, ...rest } = req.body;
        let producto = await productManager.updateProduct(pid, { ...rest }, { new: true });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        console.log('updateProduct ->', error);
        return res.status(500).json({ msg: 'Comunicarse con un administrador' });
    }
}

export const getSortProducts = async (req, res) => {
    try {
        const productos = await productManager.getSortProduct({}).sort({}).exec();
        return productos;
    } catch (error) {
        console.error('Error fetching sorted products:', error);
        throw error;
    }
}
