import { config } from "../config/config.js";
import { ConnDB } from "../config/ConnDB.js";
import { loggerDesarrollo } from "../utils.js";

export let DAO;

switch (config.PERSISTENCE.toUpperCase()) {
    case "FS":
        const fsDAO = await import("./UsuariosFsDAO.js");
        DAO = fsDAO.UsuariosFsDAO;
        break;

    case "MONGO":
        ConnDB.conectar("mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "ecommerce");
        loggerDesarrollo.info('conectada a BS');

        const mongoDAO = await import("./UsuariosMongoDAO.js");
        DAO = mongoDAO.UsuariosMongoDAO;
        break;

    default:
        throw new Error("Persistencia mal configurada... ")
        break;

} 