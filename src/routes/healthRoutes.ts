import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

/**
 * @swagger
 * /health:
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Healthy
 */
router.get("/health", (req: Request, res: Response) => {
  res.status(200);
  res.json({ message: "Healthy" });
});

export default router;
