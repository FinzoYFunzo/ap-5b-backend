import { Response, Request, Router } from "express";
import {
  getClassOffersController,
  getClassOfferByIdController,
  createClassOfferController,
  editClassOfferController,
  deleteClassOfferController
} from "../controllers/classController"
import { authenticate, autorize } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     classOffer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         authorId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Clase de Introducción a la Programación
 *         description:
 *           type: string
 *           example: Soy ayudante de Intro a la Progra', estoy en 5to año y...
 *         price:
 *           type: integer
 *           example: 20000
 *         createdAt:
 *           type: string
 *           example: 2025-10-07T22:51:55.000Z
 *         category:
 *           type: string
 *           example: Otro
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 */

/**
 * @swagger
 * paths:
 *   /class-offer/protected:
 *     get:
 *       summary: Ruta protegida para profesor
 *       description: Esta ruta solo puede ser accedida por usuarios con el rol Teacher
 *       tags:
 *         - Auth
 *       security:
 *         - cookieAuth: []
 *       responses:
 *         200:
 *           description: Acceso exitoso
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Esta es una ruta protegida, acceso exitoso
 *         401:
 *           description: El usuario no tiene los permisos suficientes
 *           content:
 *             application/json:
 *               schema: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no tiene rol Teacher.
 */
router.get("/protected", authenticate, autorize("Teacher"), (req: Request,res: Response) => {
  res.status(200).json({
    message: "Esta es una ruta protegida, acceso exitoso",
  });
})

/**
 * @swagger
 * /class-offer:
 *   get:
 *     summary: Ofertas de clase paginado
 *     description: Retorna una arreglo de tamaño `limit` con ofertas de clase.
 *     tags:
 *       - Class Offer
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número de página, empezando por 1
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de elementos por página
 *         required: false
 *     responses:
 *       200:
 *         description: Registros encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/classOffer'
 */
router.get("/", getClassOffersController)

/**
 * 
 * @swagger
 * /class-offer/{classId}:
 *   get:
 *     summary: Obtener oferta de clase por id
 *     description: Retorna una oferta de clase de oferta identificada por su id
 *     tags:
 *       - Class Offer
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id de la oferta de clase
 *     responses:
 *       200:
 *         description: Clase encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/classOffer"
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: La id, de la oferta de clase, debe ser un número.
 *       404:
 *         description: No se encontro la clase con id `classId`
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No existe una oferta de clase con id 1
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Error interno del servidor
 */
router.get("/:classId", getClassOfferByIdController);

/**
 * @swagger
 * /class-offer:
 *   post:
 *     summary: Crear oferta de clase
 *     description: Crea una oferta de clase solo, si el usuario tiene rol "Teacher"
 *     tags:
 *       - Class Offer
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id de la oferta de clase
 *     requestBody:
 *       required: true
 *       content:
 *         applicatio/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clases de Teoria de Autómatas
 *               descrition:
 *                 type: string
 *                 example: Soy ayudante de Teoria de Autómatas...
 *               prince:
 *                 type: integer
 *                 example: 25000
 *     responses:
 *       201:
 *         description: Clase creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/classOffer"
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: El titulo no puede estar vacío
 *       401:
 *         description: El usuario no tiene los permisos suficientes
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Usuario no tiene rol Teacher
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Error interno del servidor
 */
router.post("/", authenticate, autorize("Teacher"), createClassOfferController);

/**
 * @swagger
 * /class-offer/{classId}:
 *   patch:
 *     summary: Actualizar oferta de clase
 *     description: Actualiza la oferta de clase con el body entregado
 *     tags:
 *       - Class Offer
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id de la oferta de clase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Pide ya tu clase de Introducción a la Progra!
 *               description:
 *                 type: string
 *                 example: No completé la media por dedicarme a leer documentación
 *               price:
 *                 type: integer
 *                 example: 30000
 *     responses:
 *       200:
 *         description: Recurso editado con éxito
 *         content:
 *           applicarion/json:
 *             schema:
 *               $ref: "#/components/schemas/classOffer"
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: La id, de la oferta de clase, debe ser un número.
 *       401:
 *         description: El usuario no tiene los permisos suficientes
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: El recurso no pertenece al usuario.
 *       404:
 *         description: No se encontro la clase con id `classId`
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No existe una oferta de clase con id 1
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Error interno del servidor
 */
router.patch("/:classId", authenticate, autorize("Teacher"), editClassOfferController);

/**
 * @swagger
 * /class-offer/{classId}:
 *   delete:
 *     summary: Elimina una oferta de clase
 *     description: Elimina la oferta de clase con ide `classId`
 *     tags:
 *       - Class Offer
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id de la oferta de clase
 *     responses:
 *       200:
 *         description: Usuario eliminado con exito
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: La id, de la oferta de clase, debe ser un número.
 *       401:
 *         description: El usuario no tiene los permisos suficientes
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: El recurso no pertenece al usuario.
 *       404:
 *         description: No se encontro la clase con id `classId`
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No existe una oferta de clase con id 1
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Error interno del servidor
 */
router.delete("/:classId", authenticate, autorize("Teacher"), deleteClassOfferController);

export default router