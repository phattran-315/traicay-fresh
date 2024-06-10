import { TRPCError } from "@trpc/server";
import { PayloadRequest } from "payload/types";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { z } from "zod";
import { COUPON_MESSAGE } from "../../constants/api-messages.constant";
import { CartItems, Product } from "../../payload/payload-types";

import { getPayloadClient } from "../../payload/get-client-payload";
import { isEmailUser } from "../../utils/util.utls";
import getUserProcedure from "../middlewares/get-user-procedure";
import { router } from "../trpc";

const rateLimiter = new RateLimiterMemory({
  // FIXME: change later
  points: 100, // max number of points
  duration: 60 * 60, // per 1 hour,
});

const rateLimitMiddleware = getUserProcedure.use(async ({ ctx, next }) => {
  try {
    const req = ctx.req as PayloadRequest;
    await rateLimiter.consume(ctx.req.ip || req.user); // assuming ctx.ip is the user's IP
    return next();
  } catch (err) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP, please try again in an hour!",
    });
  }
});

const CouponRouter = router({
  applyCoupon: rateLimitMiddleware

    .input(z.object({ coupon: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { coupon } = input;
      try {
        const payload = await getPayloadClient();
        const { docs: coupons } = await payload.find({
          collection: "coupons",
          where: { coupon: { equals: coupon } },
        });
        if (!coupons.length)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: COUPON_MESSAGE.INVALID,
          });
        // check if the coupon still valid
        const couponInDb = coupons[0];
        if (new Date(couponInDb.expiryDate!).getTime() - Date.now() < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: COUPON_MESSAGE.EXPIRED,
          });
        }
        const isAppliedCoupon = user.cart?.items?.every(
          (item) => item.isAppliedCoupon
        );
        if (isAppliedCoupon)
          throw new TRPCError({
            code: "CONFLICT",
            message: COUPON_MESSAGE.ALREADY_APPLIED,
          });
        // apply coupon
        const updatedUserCart: CartItems = user.cart!.items!.map(
          ({ product, quantity, isAppliedCoupon, ...rest }) => {
            const cartProduct = product! as Product;
            if (!isAppliedCoupon) {
              return {
                ...rest,
                product: cartProduct.id,
                discountAmount: couponInDb.discount,
                coupon,
                quantity,
                isAppliedCoupon: true,
              };
            }
            return {
              ...rest,
              product: cartProduct.id,
              quantity,
              isAppliedCoupon,
            };
          }
        );

        if (isEmailUser(user)) {
          await payload.update({
            collection: "customers",
            where: { id: { equals: user.id } },
            data: { cart: { items: updatedUserCart } },
          });
          return {
            success: true,
            message: COUPON_MESSAGE.SUCCESS,
            updatedUserCart,
          };
        }
        if (!isEmailUser(user)) {
          await payload.update({
            collection: "customer-phone-number",
            where: { id: { equals: user.id! } },
            data: { cart: { items: updatedUserCart } },
          });
          return {
            success: true,
            message: COUPON_MESSAGE.SUCCESS,
            updatedUserCart,
          };
        }
      } catch (error) {
        throw error;
      }
    }),
  applyCouponBuyNow: rateLimitMiddleware

    .input(z.object({ coupon: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { coupon } = input;
      try {
        const payload = await getPayloadClient();
        const { docs: coupons } = await payload.find({
          collection: "coupons",
          where: { coupon: { equals: coupon } },
        });
        if (!coupons.length)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: COUPON_MESSAGE.INVALID,
          });
        // check if the coupon still valid
        const couponInDb = coupons[0];
        if (new Date(couponInDb.expiryDate!).getTime() - Date.now() < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: COUPON_MESSAGE.EXPIRED,
          });
        }
        return {
          success: true,
          message: COUPON_MESSAGE.SUCCESS,
          discount: couponInDb.discount,
        };
      } catch (error) {
        throw error;
      }
    }),
});

export default CouponRouter;
