import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "@prisma/client"


export const globalErrorHandler = (err : any, req : Request, res : Response, next : NextFunction) =>{
   // console.log(err)

   let statusCode = err.statusCode;
   let errorMessage = err.message || "Internal server Error"
   let errorName = err.name || "internal server Error"
  //  let errorDetails = err.stack


   ///! import prisma from --> client 
   //? otherwise if we import form bower then someting can be missing 
   ///*  "../../generated/prisma/client"
   if(err instanceof Prisma.PrismaClientValidationError){
      // here class is the blueprint of the object 
      statusCode  = httpStatus.BAD_REQUEST
    //   const statusCode  = httpStatus["400_NAME"]

     errorMessage = "Your have provided incorrect field type or missing fields"
   }
   else if(err instanceof Prisma.PrismaClientKnownRequestError){
      if(err.code == "P2002"){
        statusCode = httpStatus.BAD_REQUEST,
        errorMessage = "Duplicate key Error"
      }
      else if(err.code === "P2003"){
        statusCode = httpStatus.BAD_REQUEST,
        errorMessage = "Foreign key constrain failed"
      }
      else if (err.code === "P2025"){
        statusCode = httpStatus.BAD_REQUEST,
        errorMessage = "an operation failed because it depends on one or more records that wer required but not found"
      }
   }
   else if(err instanceof Prisma.PrismaClientInitializationError){
     if(err.errorCode === "P1000"){
       statusCode = httpStatus.UNAUTHORIZED,
       errorMessage = "authenticaition failed aganist databse server"
     }
     else if(err.errorCode === "P1001"){
      statusCode = httpStatus.BAD_REQUEST,
      errorMessage = "can't raach databse server"
     }
   }
   else if(err instanceof Prisma.PrismaClientUnknownRequestError){
     statusCode = httpStatus.INTERNAL_SERVER_ERROR,
     errorMessage = "error occured during query execution"
   }


  //  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  //       success: false,
  //       statusCode : httpStatus.INTERNAL_SERVER_ERROR,
  //       name : err.name,
  //       errorCode : err.code || null,
  //       message : err.message,
  //       error : err.stack
  //      })


   res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode : statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name : errorName,
        errorCode : err.code || null,
        message : errorMessage,
        error : err.stack
       })
}
