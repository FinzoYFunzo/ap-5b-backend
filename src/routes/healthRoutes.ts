import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    res.status( 200 )
    res.json({ message: "Healthy" });
});

export default router;