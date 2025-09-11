import bootstrap from "./app.controller.js";
import * as dotenv from "dotenv";

// import path  from "node:path";
// const envPath = path.resolve("./src/config/.env.dev")
// dotenv.config({path:envPath})


dotenv.config({})

bootstrap();