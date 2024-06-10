import { z } from "zod";
import { INVALID_FEEDBACK } from "../../constants/validation-message.constant";
import { getPayloadClient } from "../../payload/get-client-payload";
import { Feedback } from "../../payload/payload-types";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { isEmailUser } from "../../utils/util.utls";
import {  router } from "../trpc";
import { FEED_BACK_MESSAGE } from "../../constants/api-messages.constant";
import getUserProcedure from "../middlewares/get-user-procedure";

type FeedbackOption = NonNullable<Feedback['feedbackOptions']>[number];
const preFilledFeedback:Record<NonNullable<FeedbackOption['options']>,NonNullable<FeedbackOption['options']>>={
    'better-serve-attitude':'better-serve-attitude',
    'delivery-faster':'delivery-faster'
}
// const preFilledFeedback:Record<NonNullable<Feedback['feedbackOptions']>,NonNullable<Feedback['feedbackOptions']>>={
//   // 'better-serve-attitude':'better-serve-attitude',
//   // 'delivery-faster':'delivery-faster'
// }

const FeedbackRouter = router({
  createFeedback: getUserProcedure
    .input(z.object({ feedback: z.string().optional(),
      feedbackOptions:z.array(z.enum([preFilledFeedback['better-serve-attitude'],preFilledFeedback['delivery-faster']])).nullable().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { feedback,feedbackOptions} = input;
      const feedbackOptionValues:Feedback['feedbackOptions']=feedbackOptions?.map(option=>({options:option}))
      try {
        const payload = await getPayloadClient();
        await payload.create({
          collection: "feedback",
          data: {
            feedback,
            feedbackOptions:feedbackOptionValues,
            user: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },
          },
        });
        return {success:true,message:FEED_BACK_MESSAGE.SUCCESS}
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
    // TODO: finish trpc CRUD
    // getFeedbacks: getUserProcedure
    // .input(z.object({ feedback: z.string().min(10, INVALID_FEEDBACK) }))
    // .mutation(async ({ ctx, input }) => {
    //   const { user } = ctx;
    //   const { feedback } = input;

    //   try {
    //     const payload = await getPayloadClient();
    //     await payload.create({
    //       collection: "feedback",
    //       data: {
    //         feedback,
    //         user: {
    //           value: user.id,
    //           relationTo: isEmailUser(user)
    //             ? "customers"
    //             : "customer-phone-number",
    //         },
    //       },
    //     });
    //   } catch (error) {
    //     throwTrpcInternalServer(error);
    //   }
    // }),
});

export default FeedbackRouter