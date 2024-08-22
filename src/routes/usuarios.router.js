import usuariosController from "../controllers/usuariosController.js";
import { Router } from "express";

export const router = Router();

router.get("/", usuariosController.getUsers);
router.get("/:id", usuariosController.getUserById);
router.get("/email/:email", usuariosController.getUserByEmail);
router.put("/premium/:uid",usuariosController.putUserPremium);
router.post("/", usuariosController.postUser);
router.post("/:uid/documents", usuariosController.postUserDocuments);