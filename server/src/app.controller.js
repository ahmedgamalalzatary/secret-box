import express from "express";

import { resolve } from "node:path";
import { config } from "dotenv";
config({ path: resolve("./config/.env.dev") });


import connectDB from "./DB/DB.connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import { glopalErrorHandler } from "./utils/response.js";
import usersRouter from "./modules/users/users.controller.js";
import cors from "cors"
import messagesRouter from "./modules/messages/messages.controller.js";

import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'


const app = express();
let port = 3000;


async function bootstrap() {

 app.set("trust proxy", 1);


    await connectDB();


    

    // var whitelist = process.env.ORIGINS.split(",") || [];

    // var corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) {
    //             callback(null, true)
    //         } else {
    //             callback(new Error('Not allowed by CORS'))
    //         }
    //     }
    // }
    // app.use(cors(corsOptions))


    app.use(cors())

    app.use(helmet())

   
    const authLimiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 15,
        standardHeaders: 'draft-8',
        message: {
            error: "Too Many Requests",
            retryAfter: `5 minutes`
        }
    })
    app.use("/auth", authLimiter);

    const usersLimiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 30,
        standardHeaders: 'draft-8',
        message: {
            error: "Too Many Requests",
            retryAfter: `5 minutes`
        }
    })
    app.use("/users", usersLimiter);

    const messagessLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 30,
        standardHeaders: 'draft-8',
        message: {
            error: "Too Many Requests",
            retryAfter: `15 minutes`
        }
    })
    app.use("/messages", messagessLimiter)

    app.use(morgan("common"))

    app.use(express.json());

    app.get("/", (req, res, next) => {
        res.json({
            message: "Welcome to SecretBox 🔐",
            description: "Your secure space for managing and sharing your data safely and efficiently. Store, organize, and protect your information with top-notch security — all in one place.",
            documentation: process.env.DOCUMENTATION_URL
        });
    });

    app.use("/auth", authRouter);
    app.use("/users", usersRouter);
    app.use("/messages", messagesRouter)
    app.all("/{*dummy}", (req, res) => {
        res.status(404).json({
            message: "Faild",
            info: "Page Not Found",
            path: req.path
        });
    })

    app.use(glopalErrorHandler)

    return app.listen(port, () => {
        console.log("====================================");
        console.log("    SERVER RUN ON PORT " + port)
        console.log("====================================")
    })
}


export default bootstrap;