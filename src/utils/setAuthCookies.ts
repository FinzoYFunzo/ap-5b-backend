import jwt, { TokenExpiredError } from "jsonwebtoken";
import env from '../config/env';
import { Response } from "express";

const JWT_SECRET = env.jwt_secret;

export const generateTokens = (
    id: number, 
    email: string, 
    role: string, 
    username: string
) => {
    const token = jwt.sign(
        {id, email, role, username}, 
        JWT_SECRET, 
        {expiresIn: "1h"}
    );
    const refreshToken = jwt.sign(
        {id, email, role, username}, 
        JWT_SECRET, 
        {expiresIn: "7d"}
    );

    return {token, refreshToken};
}

export const setAuthCookies = (res: Response, token: string, refreshToken: string) => {
    const secure = env.nodeEnv === "production";
    const sameSite = secure ? "none" : "strict";

    res.cookie("access_token", token, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 1000 * 60 * 60 // 1 hora
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semana
    });
}

export const unsetAuthCookies = (res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token")
}