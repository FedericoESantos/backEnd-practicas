import mongoose from "mongoose";
import { loggerDesarrollo } from "../utils.js";

export class ConnDB{
    static #conexion;
    constructor(url, db){
        mongoose.connect(url,{dbName:db})
    }

    static conectar(url,db){
        
        if(this.#conexion){ 
            loggerDesarrollo.info('Conexion previamente establecida');
            return this.#conexion;
        }
        
        this.#conexion = new ConnDB(url,db)
        loggerDesarrollo.info('DB conectada');
        return this.#conexion;
    }
}