import { Request, Response } from "express"
import { 
  getClassOffersService, 
  getClassOfferByIdService, 
  classOfferRequestBody, 
  destroyClassOfferService, 
  editClassOfferRequestBody
} from "../services/classServices"
import { HttpError } from "../middlewares/errorHandler"
import { createClassOfferService, editClassOfferService} from "../services/classServices"
import { type } from "os"

const validateClassOfferBody = (body: classOfferRequestBody) => {
  if (!body.title?.trim())
    throw new HttpError(400, "El titulo no puede estar vacío");
  if (!body.description?.trim())
    throw new HttpError(400, "La descripción no puede estar vacía");
  if (!body.price)
    throw new HttpError(400, "El precio no puede estar vacío");
  if (typeof body.price != "number")
    throw new HttpError(400, "El precio debe ser un numero");
}

const validateEditClassOfferBody = (body: editClassOfferRequestBody) => {
  if (!(body.title || body.description || body.price))
    throw new HttpError(400, "La solicitud debe tener al menos un campo a editar.")
  if (body.title !== undefined && !body.title?.trim())
    throw new HttpError(400, "El titulo no puede estar vacío");
  if (body.description !== undefined && !body.description?.trim())
    throw new HttpError(400, "La descripción no puede estar vacía");
  if (body.price !== undefined && typeof body.price != "number")
    throw new HttpError(400, "El precio debe ser un numero");
}

export const getClassOffersController = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.page);
  const limitParam = Number(req.query.limit);
  let page: number;
  let limit: number;

  if (!isNaN(pageParam) && pageParam >= 1){
    page = pageParam
  }
  else { page = 1 } // default page es 1

  if (!isNaN(limitParam) && limitParam >= 1){
    limit = pageParam
  }
  else { limit = 10;} // default limit es 10

  const classOffers = await getClassOffersService(page, limit);
  
  res.status(200).json(classOffers)
}

export const getClassOfferByIdController = async (req: Request, res: Response) => {
  const classId = Number(req.params.classId)
  if (isNaN(classId))
    throw new HttpError(400, "La id, de la oferta de clase, debe ser un número.");

  const classOffer = await getClassOfferByIdService(classId)

  res.status(200).json(classOffer)
}

export const createClassOfferController = async (req: Request, res: Response) => {
  const userId: number = res.locals.user.id
  const reqBody = req.body as classOfferRequestBody

  validateClassOfferBody(reqBody);

  const {title, description, price} = reqBody;

  // de todos modos el service igual sanitiza
  const sanitizedBody: classOfferRequestBody = {
    title, description, price,
    authorId: userId
  }

  const classOffer = await createClassOfferService(sanitizedBody);

  res.status(201).json(classOffer)
}

export const editClassOfferController = async (req: Request, res: Response) => {
  const userId = res.locals.user.id
  const classId = Number(req.params.classId);
  const reqBody = req.body as editClassOfferRequestBody;
  
  if (isNaN(classId))
    throw new HttpError(400, "La id, de la oferta de clase, debe ser un número.");
  validateEditClassOfferBody(reqBody);

  const sanitizedBody: editClassOfferRequestBody = {
    id: classId
  }
  if(reqBody.title)       sanitizedBody.title = reqBody.title;
  if(reqBody.price)       sanitizedBody.price = reqBody.price
  if(reqBody.description) sanitizedBody.description = reqBody.description

  const classOffer = await editClassOfferService(userId, sanitizedBody)

  res.status(200).json(classOffer)
}

export const deleteClassOfferController = async (req: Request, res: Response) => {
  const userId = res.locals.user.id
  const classId = Number(req.params.classId);

  if (isNaN(classId))
    throw new HttpError(400, "La id, de la oferta de clase, debe ser un número.");

  const deleteClass = await destroyClassOfferService(userId, classId);

  res.status(200).send(deleteClass);
}