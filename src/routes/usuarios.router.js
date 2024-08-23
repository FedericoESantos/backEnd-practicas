import usuariosController from "../controllers/usuariosController.js";
import { Router } from "express";
import { upload } from "../multer.js";

export const router = Router();

router.get("/", usuariosController.getUsers);
router.get("/:id", usuariosController.getUserById);
router.get("/email/:email", usuariosController.getUserByEmail);
router.post("/premium/:uid",upload.single("profiles"),usuariosController.postUserDocuments);
router.post("/:uid/documents",usuariosController.postUserDocuments);