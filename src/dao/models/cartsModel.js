import mongoose from "mongoose"; 

const carritoCollection = "carts";
const carritoEsquema = new mongoose.Schema( 
    { 
        products:{ 
            type:[
                {
                    producto:{
                        type: mongoose.Types.ObjectId, ref:"products" 
                    },
                    cantidad: Number
                }
            ]
        }
    },
    {
        timestamps: true,
        
    }
);

export const cartModel = mongoose.model(
    carritoCollection,
    carritoEsquema
);
