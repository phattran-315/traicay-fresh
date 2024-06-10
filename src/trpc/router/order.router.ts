import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ORDER_MESSAGE } from "../../constants/api-messages.constant";
import { USER_ORDERS_SHOW_LIMIT } from "../../constants/configs.constant";
import { getPayloadClient } from "../../payload/get-client-payload";
import { Order } from "../../payload/payload-types";
import getUserProcedure from "../middlewares/get-user-procedure";
import { router } from "../trpc";

const cancelReasons: Record<
  NonNullable<Order["cancelReason"]>,
  NonNullable<Order["cancelReason"]>
> = {
  "add-change-coupon-code": "add-change-coupon-code",
  "another-reason": "another-reason",
  "bad-service-quality": "bad-service-quality",
  "dont-want-to-buy": "dont-want-to-buy",
  "update-address-phone-number": "update-address-phone-number",
};
const OrderRouter = router({
  cancelOrder: getUserProcedure
    .input(
      z.object({
        orderId: z.string(),
        cancelReason: z
          .literal(cancelReasons["add-change-coupon-code"])
          .or(z.literal(cancelReasons["another-reason"]))
          .or(z.literal(cancelReasons["bad-service-quality"]))
          .or(z.literal(cancelReasons["dont-want-to-buy"]))
          .or(z.literal(cancelReasons["update-address-phone-number"])),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { orderId, cancelReason } = input;
      // check if the same user otherwise login user knows the orderId can cancel other order
      try {
        const payload = await getPayloadClient();

        const order = await payload.findByID({
          collection: "orders",
          id: orderId,
        });
        if (!order)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: ORDER_MESSAGE.NOT_FOUND,
          });
        let orderUserId = order.orderBy.value;
        if (typeof order.orderBy.value === "object") {
          // orderUserId=
          orderUserId = order.orderBy.value.id;
        }
        if (orderUserId !== user.id || order.deliveryStatus !== "pending")
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: ORDER_MESSAGE.BAD_REQUEST,
          });

        await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            cancelReason,
            status: "canceled",
            deliveryStatus: "canceled",
          },
        });
        return { success: true, message: ORDER_MESSAGE.SUCCESS_CANCEL_ORDER };
      } catch (error) {
        throw error;
      }
    }),

  getOrders: getUserProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { page } = input;
      const payload = await getPayloadClient();
      try {
        const result = await payload.find({
          collection: "orders",

          where: {
            "orderBy.value": {
              equals: user.id,
            },
          },
          page,
          limit: USER_ORDERS_SHOW_LIMIT,
          // get all the imgs nested as well
          depth: 2,
        });
        const {
          limit,
          docs: orders,
          totalPages,
          totalDocs,
          hasNextPage,
          pagingCounter,
        } = result;
        // TODO: limit
        return {
          success: true,
          orders,
          totalPages,
          totalDocs,
          hasNextPage,
          pagingCounter,
        };
      } catch (error) {
        throw error;
      }
    }),
});
export default OrderRouter;
