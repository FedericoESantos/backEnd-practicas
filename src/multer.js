import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./src/upload");
    },

    filename: function(req,file,cb){

        cb(null, Date.now() + "-" + file.originalname)
    }
})

export const upload = multer({storage:storage});

export default __dirname;

