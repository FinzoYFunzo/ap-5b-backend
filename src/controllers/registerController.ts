import { Request, Response } from "express"
import { HttpError } from "../middlewares/errorHandler";
import { 
    registerRequestBody, 
    registerUserService,
    refreshTokenService
} from "../services/registerService"
import { generateTokens, setAuthCookies } from "../utils/setAuthCookies";


const validateRegisterBody = (body: registerRequestBody) => {
  if (!body.username?.trim()) throw new HttpError(400, "El username no puede estar vacío");
  if (!body.email?.trim()) throw new HttpError(400, "El email no puede estar vacío");
  if (!body.password?.trim()) throw new HttpError(400, "La contraseña no puede estar vacía");
  if (body.password !== body.confirm_password) throw new HttpError(400, "Error al confirmar la contraseña");
}

export const registerUserController = async (req: Request, res: Response) => {
    const reqBody = req.body as registerRequestBody;
    
    validateRegisterBody(reqBody);

    const norm_email = reqBody.email.toLowerCase();
    const { confirm_password: _, ...rest } = reqBody;
    const registBody = {...rest, email: norm_email};
    const newUser = await registerUserService(registBody);

    const { token, refreshToken } = generateTokens(
      newUser.id,
      newUser.email,
      newUser.role,
      newUser.username,
    );

    setAuthCookies(res, token, refreshToken);

    return res.status(201).json({
        user: newUser,
        token: token,
        refreshToken: refreshToken
    });
} 


export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
        throw new HttpError(400, "refreshToken faltante.");
    }

    const newTokens = await refreshTokenService(refreshToken);
    if (!newTokens) {
        throw new HttpError(401, "Autenticación denegada");
    }

    setAuthCookies(res, newTokens.token, newTokens.refreshToken);
    res.status(200).json({
        user: newTokens.user,
        token: newTokens.token,
        refreshToken: newTokens.refreshToken
    });
}