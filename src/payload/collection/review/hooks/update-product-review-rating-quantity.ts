import { Review } from "@/payload/payload-types";

import type {
  AfterChangeHook,
  AfterDeleteHook,
} from "payload/dist/collections/config/types";

export const updateProductReviewRatingQuantityAfterChange: AfterChangeHook<
  Review
> = async ({ doc, req, operation, previousDoc }) => {
  const { payload } = req;
  const productId =
    typeof doc.product === "object" ? doc.product.id : doc.product;
  const product = await payload.findByID({
    collection: "products",
    id: productId,
  });
  if (product) {
    if (operation === "create") {
      const productReviewQuantity = (product.reviewQuantity || 0) + 1;
      const totalRating = (product.totalRating || 0) + doc.rating;
      const productRatingAverage = totalRating / productReviewQuantity;
      await payload.update({
        collection: "products",
        id: productId,
        data: {
          reviewQuantity: productReviewQuantity,
          ratingAverage: productRatingAverage || 0,
          totalRating,
        },
      });
    }
    if (operation === "update") {
      const productReviewQuantity = product.reviewQuantity!;

      const previousRating = previousDoc.rating;
      const totalRating = product.totalRating! - previousRating + doc.rating;
      const productRatingAverage = totalRating / productReviewQuantity;
      await payload.update({
        collection: "products",
        id: productId,
        data: {
          ratingAverage: productRatingAverage,
          totalRating,
        },
      });
    }
  }

  return;
};

export const updateProductReviewRatingQuantityAfterDelete: AfterDeleteHook<
  Review
> = async ({ req, doc }) => {
  const { payload } = req;
  const productId =
    typeof doc.product === "object" ? doc.product.id : doc.product;
  const product = await payload.findByID({
    collection: "products",
    id: productId,
  });

  if (product) {
    const productReviewQuantity = product.reviewQuantity! - 1;
    const totalRating = product.totalRating! - doc.rating;
    const ratingAverage =
      productReviewQuantity === 0 ? 0 : totalRating / productReviewQuantity;
    await payload.update({
      collection: "products",
      id: productId,
      data: {
        totalRating,
        ratingAverage,
        reviewQuantity: productReviewQuantity,
      },
    });
  }
};
