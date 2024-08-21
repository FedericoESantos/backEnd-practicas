import mongoose from "mongoose";

export const usuarioModel = mongoose.model("usuarios",
    new mongoose.Schema({
        first_name: String,
        last_name: String,
        email:{
            type: String, unique:true
        },
        documents:{
            name: String,
            reference: String
        },
        age: Number,
        password: String,
        carts: Number, 
        rol:{
            type: String, default:"user"
        },
        last_conecction: true,
    },
{
    timestamps: true, strict: false
    
}))