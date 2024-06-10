import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../utils/errors.util"
import catchAsync from "../utils/catchAsync";
import { PayloadRequest } from "payload/types";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // jwt exist
    let token: string | undefined;
    const request=req as PayloadRequest
    console.log(request.headers)
    if(request.user){
        next()
    }
next()
    // const requestHeaderAuth = req.headers.authorization;
    // if (requestHeaderAuth && requestHeaderAuth.startsWith("Bearer")) {
    //   token = requestHeaderAuth.split(" ")[1];
    // }
    // if (!token)
    //   return next(
    //     new UnAuthorizedError(`You're not login.Please login and try again.`)
    //   );
    // // valid jwt
    // // @ts-ignore
    // const decoded: { id: string; iat: number; exp: number } = await verifyJwt(
    //   token
    // );
    // // find user still exist
    // const user = await findOne(User, decoded.id);
    // if (!user)
    //   return next(
    //     new NotFoundError(`User belongs to this token no longer exist.`)
    //   );
    // // user change password after token was issued
    // if (
    //   user.passwordChangeAt &&
    //   user.isPasswordChangeAfterIssued(decoded.iat)
    // ) {
    //   return next(
    //     new BadRequestError(`User recently change password.Please login again`)
    //   );
    // }
    // // assign user to the next middleware

    // req.user = user;
    // next();
  }
);
