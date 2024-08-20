import { afterEach, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose, { isValidObjectId } from "mongoose";

import fs from "fs";

const requester = supertest("http://localhost:8000");
// supertest nos permite lanzar peticiones hacia un sitio web 
// mientras que chai nos permite hacer afirmaciones mediante expect

let { body, status, ok, headers } = await requester.get("/api/usuarios");
console.log(body);

describe("Prueba proyecto Ecommerce", function(){

    this.timeout(10000);

    describe("Pruebas router usuarios", function(){
        
        afterEach(async function () {
            await mongoose.connection.collection("usuarios").deleteMany({email:""})
        })

        it("La ruta /api/usuarios, en su metodo get, retorna un array de usuarios", async function(){

            let { body } = await requester.get("/api/usuarios");

            expect(Array.isArray(body.payload)).to.be.true;
            expect(body.status).to.exist.and.to.be.equal("success");
        })

        it("La ruta /registro, en su metodo post, crea un usuario", async function(){
            let mockUsuario = { first_name: "test", last_name: "test", email: "email", password: "123" };
            let { body } = await requester.post("/registro").send(mockUsuario);

            expect(body.payload).to.exist.and.to.be.equal("success");
            expect(body.payload).to.exist;
            expect(isValidObjectId(body.payload)).to.be.true;
            fs.unlinkSync(body.payload.image)
        })

    })

    describe("pruebas router pets", function(){
        afterEach(async function() {
            await mongoose.connection.collection("pets").deleteMany({species:"test"})
        })
        
        it("la ruta /api/pets/withimage en su metodo post crea una mascota y acepta una imagen", async()=>{
            let mockPet = {
                name: "roger",
                especie: "testing",
                birthdate:"2021-04-04"
            }

            let {body} = await requester.post("/api/pets/withimage")
                                            .field("name", mockPet.name)
                                            .field("especie", mockPet.especie)
                                            .field("birthDate", mockPet.birthdate)
                                            .attach("image", "./test/1.jpeg") // aca va la ruta a la imagen
            expect(body.status).to.be.equal("sucess")
            expect(isValidObjectId(body.payload._id)).to.be.true
            expect(fs.existsSync(body.payload.image)).to.be.true

        })


    })

})