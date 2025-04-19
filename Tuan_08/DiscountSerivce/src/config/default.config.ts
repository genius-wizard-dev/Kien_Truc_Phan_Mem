import dotenv from "dotenv";
import { Env } from "../shared";
dotenv.config();

console.log(process.env.DEV_MONGODB_URI);
const DEV = {
    PORT: process.env.DEV_APP_PORT as string,
    ENV: Env.DEV as string,
    MONGODB: {
        URI: process.env.DEV_MONGODB_URI as string
    }
};

const PRO = {
    PORT: process.env.PRO_APP_PORT as string,
    ENV: Env.PRO as string,
    MONGODB: {
        URI: process.env.PRO_MONGODB_URI as string
    }
};

const config = { DEV, PRO };

const NODE_ENV = (process.env.NODE_ENV as string) === "DEV" ? "DEV" : "PRO";

export default config[NODE_ENV];
