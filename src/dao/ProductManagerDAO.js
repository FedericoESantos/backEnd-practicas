import { productModel } from "./models/productModel.js";

export class ProductManager{

    async getAll(){
        return await productModel.find().lean();
    }

    async getProductBy(filtro){
        return await productModel.findById(filtro).lean();
    }

    async getAllPaginate(page){
        return await productModel.paginate({},{limit:10, page, lean:true})
    } 

    async createProduct(producto){
        let nuevoProducto = await productModel.create(producto); 
        return nuevoProducto.toJSON(); 
    }

    async updateProduct(id, resto, update){
        return await productModel.findByIdAndUpdate(id, resto, update);
    }

    async deleteProduct(id){
        return await productModel.findByIdAndDelete(id);
    }

    async getSortProduct(){
        return productModel.find();
    }

}