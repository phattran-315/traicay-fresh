import "server-only";

import { getPayloadClient } from "@/payload/get-client-payload";

export const getProducts = async (limit?: number) => {
  try {
    const payload = await getPayloadClient();
    const { docs: products } = await payload.find({
      collection: "products",
      // Only get 3 products to shows
      limit: limit,
      
    });
    return { data: products, ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null };
  }
};
export const getPriorityProducts = async () => {
  try {
    const payload = await getPayloadClient();
    const { docs: products } = await payload.find({
      collection: "products",
        
      // Only get 3 products to shows
      where: {
        priority: {
          equals: true,
        },
      },
    });
    return { data: products, ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null };
  }
};

export const getProduct = async ({ id }: { id: string }) => {
  try {
    const payload = await getPayloadClient();
    // await payload[config['authenticate']]
    // payload['']
    const product = await payload.findByID({
      collection: "products",
      id,
    });

    return { ok: true, data: product };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null };
    // throw new Error(GENERAL_ERROR_MESSAGE);
  }
};
