import express from 'express';
import cors from "cors";
import { errorHandler } from './middlewares/errorHandler';
import exampleRoutes from './routes/exampleRoutes';
import healthRoutes from "./routes/healthRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Claseando API',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.ts'] // Ruta de las anotaciones
};

const swaggerSpec = swaggerJSDoc(options);

export const createApp = () => {
    const app = express();

    app.use(errorHandler);
    app.use(cors());

    app.use(express.json()); // body parser

    app.use("/", exampleRoutes);
    app.use("/", healthRoutes);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger

    return app;
}
