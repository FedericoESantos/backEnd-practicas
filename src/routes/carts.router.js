import { Router } from "express";
import { addProductCart, createCart, getCartById } from "../controllers/carts.js";

const router = Router();

router.get("/:cid/purchase", (req,res)=>{
    let cartID = getCartById; 

    res.setHeader('Content-Type', 'text/html');
    return res.render("cart",{cartID});
})

router.post("/", createCart); 

router.post("/:cid/product/:pid",addProductCart); 

export default router;







