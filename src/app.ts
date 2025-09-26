import express from 'express';
import cors from "cors";
import { errorHandler } from './middlewares/errorHandler';
import exampleRoutes from './routes/exampleRoutes';
import healthRoutes from "./routes/healthRoutes";

export const createApp = () => {
    const app = express();

    app.use(errorHandler);
    app.use(cors());

    app.use(express.json()); // body parser
    
    app.use("/", exampleRoutes);
    app.use("/", healthRoutes);
    
    return app;
}