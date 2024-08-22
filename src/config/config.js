import dotenv from "dotenv";

dotenv.config( 
    {
        path: "./src/.env",
        override:true 
    }
)
export const config = {
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    PERSISTENCE: process.env.PERSISTENCE || "FS"
}