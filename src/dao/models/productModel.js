import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productosCollection = "products"; 
const productosEsquema = new mongoose.Schema( 
    { 
        title: String, 
        description: String,
        code: {type:String, unique:true, required:true},
        price:Number,
        stock:{
            type: Number, default:0 
        },
        category:String,
        thumbnail:[{type:String}],
        status: {type:Boolean, default:true}
    },
    {  
        timestamps: true, 
        
    }
);

productosEsquema.plugin(paginate);
productosEsquema.index({title:1}); 

export const productModel = mongoose.model(
    productosCollection,
    productosEsquema
);

