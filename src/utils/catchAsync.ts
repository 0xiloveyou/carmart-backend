import { NextFunction, Request, RequestHandler, Response} from "express";

export const catchAsync = (fnnc : RequestHandler) => {

   return async (req : Request, res : Response, next : NextFunction) => {
      try {
         await fnnc(req, res, next)
      } catch (error) {
       next(error) // pass to global error handler
      }
   }
}