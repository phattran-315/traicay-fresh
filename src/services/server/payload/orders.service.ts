import "server-only";

import { getPayloadClient } from "@/payload/get-client-payload";
import { USER_ORDERS_SHOW_LIMIT } from "@/constants/configs.constant";

export const getUserOrders = async ({ userId }: { userId: string }) => {
  try {
    const payload = await getPayloadClient();
    const {
      docs: orders,
      totalPages,
      totalDocs,
      hasNextPage,
    } = await payload.find({
      collection: "orders",
      where: {
        "orderBy.value": {
          equals: userId,
        },
      },
      limit:USER_ORDERS_SHOW_LIMIT,
      // get all the imgs nested as well
      depth: 2,
      // pagination:3
    });
    // TODO: limit
    return { success: true, data: { orders, hasNextPage } };
  } catch (error) {
    return { ok: false, data: null };
  }
};
export const getOrderStatus = async ({ orderId }: { orderId: string }) => {
  try {
    const payload = await getPayloadClient();
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
      depth: 2,
      
    });
    return { success: true, data: order };
  } catch (error) {
    return { ok: false, data: null };
  }
};

export const getUserOrdersNoPopulate = async ({ userId }: { userId: string }) => {
  try {
    const payload = await getPayloadClient();
    const {
      docs: orders,
      hasNextPage,
    } = await payload.find({
      collection: "orders",
      where: {
        "orderBy.value": {
          equals: userId,
        },
      },
      // get all the imgs nested as well
      depth: 0,
      // pagination:3
    });
    // TODO: limit
    if(!orders.length) return {success:true,data:null}

    return { success: true, data: { orders, hasNextPage } };
  } catch (error) {
    return { ok: false, data: null };
  }
};