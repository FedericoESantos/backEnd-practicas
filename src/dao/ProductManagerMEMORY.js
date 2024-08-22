import fs from "fs";
import { loggerDesarrollo } from "../utils";
const rutaArchivo = "../data/productos.json";

class ProductManager {
    static idProducto = 0;

    constructor(rutaArchivo) {
        this.path = rutaArchivo;
        this.products=this.getAll();
    }

    getAll() { 
        try {
            if (fs.existsSync(this.path)) { 
                return JSON.parse(fs.readFileSync(this.path, { encoding: "utf-8" }));
            }
        } catch (error) {
            loggerDesarrollo.info(`ocurrió un error al leer el archivo de productos, error: ${error}`)
        }
    }

    guardarArchivo() {
        try {
            fs.writeFileSync(rutaArchivo, JSON.stringify(this.products));
            loggerDesarrollo.info("Guardado Exitosamente");
        }
        catch (error) {
            loggerDesarrollo.error(`ocurrió un error al guardar el archivo de productos, error: ${error}`);
        }
    }

    updateProduct(id, objetoActualizdo){
        let indice = this.products.findIndex(prod=>prod.id === id); 

        if(indice !== -1){ 

            const {id, ...resto} = objetoActualizdo; 
            this.products[indice] = {...this.products[indice], ...resto}; 
            this.guardarArchivo(); 
            loggerDesarrollo.info("El producto se ha actualizado");
        }
    }

    deleteProduct(id){
        let indice = this.products.findIndex(prod=>prod.id === id); 
        if(indice !== -1){ 
            this.products = this.products.filter(prod=> prod.id !== id);
                this.guardarArchivo(); 
                loggerDesarrollo.info("Producto Eliminado...");
        }
        return loggerDesarrollo.info("El producto con el ID ${id} no existe");
    }

    asignarId(){
        let id = 1; 
        if(this.products.length>0) 
            id = this.products[this.products.length-1].id + 1;
        return id;
    }

    getProductById(id){
        const producto = this.products.find(prod => prod.id === id);
        if(producto){
            return producto;
        }else{
            return loggerDesarrollo.error(`No encontramos el producto con ID ${id}`);
        }
    }

    addProduct({id, nombre, alias, superpoder, equipo, energia, status=true}) {
        let productos = this.products;
        
        let resultado = "Ocurrio un ERROR";
        if(!id || !nombre || !alias || !superpoder || !equipo  || !energia){
            return "Todos los parámetros son requeridos";
        }
        const existe = productos.find(producto=>producto.code == code); 
        
        if(existe){
            return loggerDesarrollo.error(`ERROR ... El código ${code} ya se encuentra registrado`);
        }
        ProductManager.idProducto = ProductManager.idProducto +1;
        this.asignarId();

        const producto = {
            id,
            nombre,
            alias,
            superpoder,
            equipo,
            energia
        }
        productos.push(producto);  
        this.guardarArchivo();
        resultado = {
            mensaje: "producto agregado existosamente",
            producto: producto
        };
        return resultado;
    }
}
export default ProductManager;