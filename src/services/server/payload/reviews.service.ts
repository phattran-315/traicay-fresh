import { getPayloadClient } from "@/payload/get-client-payload";

export const getProductReviews = async ({
  productId,
  limit
}: {
  productId: string;
  limit?:number
}) => {
  try {
    const payload = await getPayloadClient();
    const { docs: reviews,totalPages } = await payload.find({
      collection: "reviews",
      limit,
      where: {
        product: {
          equals: productId,
        },
      },
    });

    return { success: true, data: {reviews,totalPages} };
  } catch (error) {
    return { ok: false, data: null };
  }
};

export const checkUserHasReviewed = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  try {
    const payload = await getPayloadClient();
    const { docs: userReview } = await payload.find({
      collection: "reviews",
      depth:1,
      where: {
        and: [
          {
            "user.value": {
              equals: userId,
            },
          },
          {
            product: {
              equals: productId,
            },
          },
        ],
      },
    });

    if (!userReview.length) return { success: true, data: null };
    return { success: true, data: userReview };
  } catch (error) {
    return { ok: false, data: null };
  }
};
