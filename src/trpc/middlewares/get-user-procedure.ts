import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import {
  AUTH_MESSAGE,
  USER_MESSAGE,
} from "../../constants/api-messages.constant";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../../constants/configs.constant";
import { getPayloadClient } from "../../payload/get-client-payload";
import { ERROR_JWT_CODE, verifyToken } from "../../utils/auth.util";

import { publicProcedure } from "../trpc";
import { PayloadRequest } from "payload/types";
import { Customer, CustomerPhoneNumber } from "../../payload/payload-types";

const getUserProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const request = ctx.req as PayloadRequest;
  
  if (request.user) {
    const user=request.user as Customer|CustomerPhoneNumber
    return next({ ctx: { user } });
  }
  const headerCookie = ctx.req.headers.cookie;
  const parsedCookie = cookie.parse(headerCookie || "");
  const token = parsedCookie[COOKIE_USER_PHONE_NUMBER_TOKEN];
  if (!token)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: AUTH_MESSAGE.EXPIRED,
    });
  const decodedToken = await verifyToken(token);

  if (decodedToken.code === ERROR_JWT_CODE.ERR_JWS_INVALID) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: AUTH_MESSAGE.INVALID_OTP,
    });
  }
  if (decodedToken.code === ERROR_JWT_CODE.ERR_JWT_EXPIRED) {
    throw new TRPCError({ code: "BAD_REQUEST", message: AUTH_MESSAGE.EXPIRED });
  }
  // @ts-ignore
  const userId = decodedToken?.userId;
  const payload = await getPayloadClient();
  const user = await payload.findByID({
    collection: "customer-phone-number",
    id: userId || "",
  });
  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: USER_MESSAGE.NOT_FOUND,
    });
  return next({ ctx: { user } });
});

export default getUserProcedure;
