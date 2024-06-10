import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import { PayloadRequest } from "payload/types";
import { Customer } from "@/payload/payload-types";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../constants/configs.constant";
import { AUTH_MESSAGE, USER_MESSAGE } from "../constants/api-messages.constant";
import { ERROR_JWT_CODE, verifyToken } from "../utils/auth.util";
import { getPayloadClient } from "../payload/get-client-payload";
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers

const authMiddleWare = t.middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest;
  const user = req.user as Customer | null;
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vui lòng đăng nhập",
    });
  }
  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;
export enum USER_TYPE {
  email = "email",
  phoneNumber = "phoneNumber",
}

export const privateProcedure = t.procedure.use(authMiddleWare);
