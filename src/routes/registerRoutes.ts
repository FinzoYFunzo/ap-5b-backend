import { Response, Request, Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  registerUserController,
  refreshTokenController,
} from "../controllers/registerController";

const router = Router();

router.post("/register", registerUserController);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registro de usuario
 *     description: Registra un nuevo usuario en el sistema y devuelve sus datos junto con los tokens de autenticación.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               username:
 *                 type: string
 *                 example: string
 *               email:
 *                 type: string
 *                 format: email
 *                 example: string
 *               password:
 *                 type: string
 *                 format: password
 *                 example: string
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     username:
 *                       type: string
 *                       example: string
 *                     first_name:
 *                       type: string
 *                       nullable: true
 *                     last_name_1:
 *                       type: string
 *                       nullable: true
 *                     last_name_2:
 *                       type: string
 *                       nullable: true
 *                     email:
 *                       type: string
 *                       example: string
 *                     password:
 *                       type: string
 *                       description: Contraseña hasheada
 *                       example: hash(password)
 *                     role:
 *                       type: string
 *                       example: Student
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                 token:
 *                   type: string
 *                   description: Token JWT de acceso
 *                   example: srting
 *                 refreshToken:
 *                   type: string
 *                   description: Token JWT de refresco
 *                   example: string
 *       400:
 *         description: Error en los datos de entrada (validación fallida)
 *       409:
 *         description: El nombre de usuario o el correo ya están en uso
 *       500:
 *         description: Error interno del servidor
 */

router.get("/protected", authenticate, (req: Request, res: Response) => {
  res.status(200).json({
    message: "Esta es una ruta protegida, acceso exitoso",
  });
});
/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Ruta protegida
 *     description: Requiere un token de acceso válido en las cookies (`access_token`). Devuelve un mensaje de éxito si la autenticación es correcta.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Acceso exitoso a la ruta protegida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Esta es una ruta protegida, acceso exitoso
 *       401:
 *         description: Error de autenticación (token inválido, expirado o ausente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Autenticación fallida, Token expirado.
 */

router.get("/refresh-token", refreshTokenController);
/**
 * @swagger
 * /refresh-token:
 *   get:
 *     summary: Refrescar tokens de autenticación
 *     description: Genera un nuevo access token y refresh token a partir de la cookie `refresh_token`. También renueva las cookies en la respuesta.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tokens refrescados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     username:
 *                       type: string
 *                       example: string
 *                     first_name:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     last_name_1:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     last_name_2:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     email:
 *                       type: string
 *                       example: string
 *                     role:
 *                       type: string
 *                       example: Student
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                 token:
 *                   type: string
 *                   description: Nuevo access token (JWT)
 *                 refreshToken:
 *                   type: string
 *                   description: Nuevo refresh token (JWT)
 *       400:
 *         description: Refresh token faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: refreshToken faltante.
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Autenticación denegada
 */

export default router;
