import { Router } from "express";
import {Request, Response} from "express";

const router = Router();

router.get("/example", (req: Request, res: Response) => {
    res.send("Hola papitos y mamitas")
});

export default router;