import { Router } from "express";
import {Request, Response} from "express";

const router = Router();

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Health check
 *     description: Returns API health status
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Hola papitos y mamitas 
 */
router.get("/example", (req: Request, res: Response) => {
    res.send("Hola papitos y mamitas")
});

export default router;