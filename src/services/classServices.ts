import { PrismaClient, User } from "@prisma/client";
import { kStringMaxLength } from "buffer";
import { HttpError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export interface classOfferRequestBody {
  title: string;
  description: string;
  price: number;
  authorId: number;
}

export interface editClassOfferRequestBody {
  id: number;
  title?: string;
  description?: string;
  price?: number;
}

export const getClassOffersService = async (page: number, limit: number) => {
  try {
    return await prisma.classOffer.findMany(
      {
        skip: (page - 1) * limit,
        take: limit
      }
    )
  } catch (error) {
    throw new HttpError(500, "Error interno del servidor");
  }
};

export const getClassOfferByIdService = async (classId: number) => {
  try {
    const classOffer = await prisma.classOffer.findUnique({
      where: {
        id: classId
      }
    })

    if (!classOffer)
      throw new HttpError(404, `No existe una oferta de clase con id ${classId}`)

    return classOffer

  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(500, "Error interno del servidor");
  }
}

export const createClassOfferService = async (
  reqBody: classOfferRequestBody
) => {
  try {
    return await prisma.classOffer.create({
      data: {
        title: reqBody.title,
        description: reqBody.description,
        price: reqBody.price,
        author: { connect: { id: reqBody.authorId } }
      }
    })
  } catch (error) {
    throw new HttpError(500, "Error interno en el servidor.")
  }
}

export const editClassOfferService = async (
  userId: number,
  reqBody: editClassOfferRequestBody
) => {
  try {
    const {id, ...updateData} = reqBody

    const classOffer = await prisma.classOffer.findFirst({
      where: {
        id: id
      }
    })

    if (!classOffer)
      throw new HttpError(404, `No existe una oferta de clase con id ${id}.`)
    if (classOffer?.authorId != userId)
      throw new HttpError(401, "El recurso no pertenece al usuario.")
    
    const updateClassOffer = await prisma.classOffer.update({
      where: {
        id: id
      },
      data: updateData
    })

    return classOffer
  } catch (error: any) {
    if (error instanceof HttpError) throw error
    if (error.code === "P2025") throw new HttpError(404, `No existe una oferta de clase con id ${reqBody.id}`)
    throw new HttpError(500, "Error interno del servidor");
  }
}

export const destroyClassOfferService = async (userId: number, classOfferId: number) => {
  try {
    const classOffer = await prisma.classOffer.findFirst({
      where: {
        id: classOfferId
      }
    })

    if (!classOffer)
      throw new HttpError(404, `No existe una oferta de clase con id ${classOfferId}.`)
    if (classOffer?.authorId != userId)
      throw new HttpError(401, "El recurso no pertenece al usuario.")

    const deleteClassOffer = await prisma.classOffer.delete({
      where: {
        id: classOfferId
      }
    })

    return deleteClassOffer

  } catch (error: any) {
    if (error instanceof HttpError) throw error
    throw new HttpError(500, "Error interno del servidor");
  }
}