import { RateLimiterMemory } from "rate-limiter-flexible";

import { TRPCError } from "@trpc/server";
import { PayloadRequest } from "payload/types";
import { publicProcedure } from "../trpc";
const rateLimiter = new RateLimiterMemory({
  points: 100, // max number of points
  duration: 60 * 60, // per 1 hour
});
const rateLimitMiddleware = publicProcedure.use(async ({ ctx, next }) => {
  try {
    const req = ctx.req as PayloadRequest;
    await rateLimiter.consume(ctx.req.ip || req.user); // assuming ctx.ip is the user's IP
    return next();
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Too many requests from this IP, please try again in an hour!",
    });
  }
});
export default rateLimitMiddleware;
