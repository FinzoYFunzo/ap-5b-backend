import { Request, Response, NextFunction } from "express";
import env from "../config/env";
import { HttpError } from "./errorHandler";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  username: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.cookies['access_token'];
    if(!token) throw new HttpError(401, "Autenticación fallida.");

    try {
        const decoded = jwt.verify(token, env.jwt_secret) as TokenPayload;
        // luego en los controladores y servicios se puede acceder a algunos datos del usuario
        res.locals.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            profile_picture: decoded.username,
        };
        next();

    } catch(error) {
        let errorMessage = "Token inválido o expirado.";
        if (error instanceof TokenExpiredError) {
            errorMessage = "Autenticación fallida: Token expirado.";
        } else if (error instanceof JsonWebTokenError) {
            errorMessage = `Autenticación fallida: ${error.message}`;
        } else {
            console.error("Error inesperado durante la verificación del token:", error);
            errorMessage =
            "Autenticación fallida por un error inesperado durante la verificación del token.";
        }
        throw new HttpError(401, errorMessage);
    }
}