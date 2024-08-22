import { fileURLToPath } from "url";
import { dirname } from "path";

import bcrypt from "bcrypt";
import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const SECRET = "CoderCoder123"; 

export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validaPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

let customLevels = { 
    fatal: 0, 
    error: 1, 
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

export const loggerDesarrollo = winston.createLogger(
    { 
        levels: customLevels,
        transports: [
            new winston.transports.Console(
                {
                    format: winston.format.timestamp()
                }
            )
        ]
    }
)

export const loggerProduccion = winston.createLogger(
    { 
        levels: customLevels,
        transports: [
            new winston.transports.File(
                {
                    level: "error",
                    filename: "./src/errors.log",
                    format: winston.format.combine(
                        winston.format.timestamp()
                    ),
                }
            )
        ]
    }
)

export const middLogger = (req, res, next) => { 
    req.loggerProd = loggerProduccion;
    req.loggerDes = loggerDesarrollo;
    next();
}