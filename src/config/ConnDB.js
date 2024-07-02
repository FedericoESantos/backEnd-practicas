import mongoose from "mongoose";
// con esto creamos el patron Singleton
export class ConnDB{
    static #conexion;
    constructor(url, db){
        mongoose.connect(url,{dbName:db})
    }

    static conectar(url,db){
        // si alguien ya paso por esta conexion
        if(this.#conexion){ 
            console.log('Conexion previamente establecida');
            return this.#conexion;
        }
        // si no paso la creo - creo un flag
        this.#conexion = new ConnDB(url,db)
        console.log('DB conectada');
        return this.#conexion;
    }
}