import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (
    payload : JwtPayload, 
    secret : string,
    expiresIn : string
    ) => {

    const token = jwt.sign(
        payload, 
        secret,
        { expiresIn } as SignOptions
    )

    return token
}

/// jwt verify fucntion retrun 2 thing 
/*
if verified the return payload 
else strign(accessToken) + error message 
*/
const verifyToken = (token : string, secret : string) => {
   try {
    const verifiedToken = jwt.verify(token, secret)
   //  return verifiedToken

   return { success : true, data : verifiedToken}

   } catch (error : any) {
      console.log("token verification failed", error)
      // throw new Error (error.message)
      return {
         success : false,
         error : error.message
      }
   }
}

export const jwtUtils = {
   createToken,
   verifyToken
}
