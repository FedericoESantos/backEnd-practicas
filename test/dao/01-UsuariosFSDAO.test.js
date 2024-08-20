import { UsuariosFsDAO } from "../../src/dao/UsuariosFsDAO.js";
import mongoose from "mongoose";
import Assert from "assert";
import { describe, it } from "mocha";

import { ConnDB } from "../../src/config/ConnDB.js";

const assert = Assert.strict; 
// el assert sirve para confirmaciones

ConnDB.conectar("mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "ecommerce");

// El "describe" es una funcion que nos sirve para describir un entorno de trabajo
describe("Pruebas Dao Usuarios", function(){
    this.timeout(10000)

    before(async function(){
        this.dao = new UsuariosFsDAO();
        // con este this instanciamos la clase UsuariosFSDAO
        await mongoose.connection.collection("usuarios").deleteMany({email:"test2024@test.com"})
    })

    afterEach(async function(){
        this.dao = new UsuariosFsDAO();
        // con este this instanciamos la clase UsuariosFSDAO
        await mongoose.connection.collection("usuarios").deleteMany({email:"test2024@test.com"})
    })

    it("El dao con su metodo get retorna un array de usuarios", async function(){
        let resultado = await this.dao.get()
        console.log(resultado);

        // assert.equal significa que va a ser igual y este metodo acepta 2 parametros
        if(assert.equal(Array.isArray(resultado), true) && resultado.length>0){

            let usuarioDeshidratado = resultado[0].toJSON();

            assert.equal(Object.keys(usuarioDeshidratado).includes("_id"), true)
            assert.equal(Object.keys(usuarioDeshidratado).includes("email"), true)
        }

    })

    it("El dao, con su metodo save, crea un usuario en la DB", async function(){

        let mockUsuario = { first_name: "test", last_name: "test", email: "test2024@test.com", contraseña:"123" } 
        let resultado = await this.dao.create(mockUsuario);

        console.log(resultado);

        assert.ok(resultado._id);

    })



}); 