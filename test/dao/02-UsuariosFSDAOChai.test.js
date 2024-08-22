import { UsuariosFsDAO } from "../../src/dao/UsuariosFsDAO.js";
import mongoose from "mongoose";
import Assert from "assert";
import { afterEach, before, describe, it } from "mocha";
import { expect, should } from "chai";
import { ConnDB } from "../../src/config/ConnDB.js";

should();

ConnDB.conectar("mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "ecommerce");

describe("Pruebas Dao Usuarios usando CHAI", function(){
    this.timeout(10000)

    before(async function(){
        this.dao = new UsuariosFsDAO();
        
        await mongoose.connection.collection("usuarios").deleteMany({email:"test2024@test.com"})
    })

    afterEach(async function(){
        this.dao = new UsuariosFsDAO();
        
        await mongoose.connection.collection("usuarios").deleteMany({email:"test2024@test.com"})
    })

    it("CHAI: El dao con su metodo get retorna un array de usuarios", async function(){
        let resultado = await this.dao.get()
        
        expect(resultado).to.be.null;
        
        if(Array.isArray(resultado), true && resultado.length>0){

            expect(resultado[0]._id).to.exist;

            expect(resultado[0].email).to.exist;

            let usuarioDeshidratado = resultado[0].toJSON();
            expect(Object.keys(usuarioDeshidratado).includes("_id").to.be.true);

            expect(Object.keys(usuarioDeshidratado)).includes("_id"); 
            expect(Object.keys(usuarioDeshidratado)).includes("email");
        }

    })

    it("El dao, con su metodo save, crea un usuario en la DB", async function(){

        let mockUsuario = { first_name: "test", last_name: "test", email: "test2024@test.com", contraseña:"123" } 
        let resultado = await this.dao.create(mockUsuario);

        expect(resultado._id).to.exist;
        
    })

}); 