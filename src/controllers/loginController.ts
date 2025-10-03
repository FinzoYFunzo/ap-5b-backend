import { Request, Response } from "express"
import { HttpError } from "../middlewares/errorHandler";
import { loginUserService, loginRequestBody } from "../services/loginServices";
import { generateTokens, setAuthCookies, unsetAuthCookies } from "../utils/setAuthCookies";



const validateLoginBody = (body: loginRequestBody) => {
    if (!body.login?.trim()) throw new HttpError(400, "El identificador no puede estar vacío")
    if (!body.password?.trim()) throw new HttpError(400, "La contraseña no puede estar vacío")
}

export const loginUserController = async (req: Request, res: Response) => {
    const reqBody = req.body as loginRequestBody;
    validateLoginBody(reqBody);
    
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reqBody.login)
    if (isEmail) { reqBody.login.toLocaleLowerCase() }

    const logUser = await loginUserService(reqBody)

    const { token, refreshToken } = generateTokens(
          logUser.id,
          logUser.email,
          logUser.role,
          logUser.username,
    );

    setAuthCookies(res, token, refreshToken);

    return res.status(200).json({
        user: logUser,
        token: token,
        refreshToken: refreshToken
    });
}