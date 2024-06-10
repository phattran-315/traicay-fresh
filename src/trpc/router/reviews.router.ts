import { z } from "zod";
import { getPayloadClient } from "../../payload/get-client-payload";

import getUserProcedure from "../middlewares/get-user-procedure";
import { publicProcedure, router } from "../trpc";

import { PRODUCT_REVIEWS_SHOW_LIMIT } from "../../constants/configs.constant";
import { REVIEW_MESSAGE } from "../../constants/api-messages.constant";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ReviewRouter = router({
  deleteReviewImg: getUserProcedure
    .input(z.object({ imgId: z.string(), reviewId: z.string() }))
    .mutation(async ({ input }) => {
      const { imgId, reviewId } = input;
      try {
        const payload = await getPayloadClient();
        await payload.delete({ collection: "media", id: imgId });
        const review = await payload.findByID({
          collection: "reviews",
          id: reviewId,
          depth: 0,
        });
        if (review) {
          const reviewImgs = review.reviewImgs;
          const filterImgs = reviewImgs?.filter(
            (img) => img.reviewImg !== imgId
          );
          await payload.update({
            collection: "reviews",
            id: reviewId,
            data: { reviewImgs: filterImgs },
          });
        }
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  deleteReview: getUserProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ input }) => {
      const { reviewId } = input;
      try {
        const payload = await getPayloadClient();
        await payload.delete({ collection: "reviews", id: reviewId });
        return { success: true, message: REVIEW_MESSAGE.DELETE_SUCCESSFULLY };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),

  getProductReviews: publicProcedure
    .input(z.object({page:z.number(), productId: z.string() }))
    .query(async ({ input }) => {
      const { productId ,page} = input;
      try {
        const payload = await getPayloadClient();
        const result = await payload.find({
          collection: "reviews",
          depth: 1,
          page,
          where: {
            product: {
              equals: productId,
            },
          },
          limit: PRODUCT_REVIEWS_SHOW_LIMIT,
        });
        const {limit,docs:reviews,totalPages,totalDocs,hasNextPage,pagingCounter}=result

        return { success: true, productReviews: reviews,totalPages,totalDocs,hasNextPage, pagingCounter };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
















  
});
export default ReviewRouter;
