'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { Feedback } from "@/payload/payload-types";
import useDisableClicking from "@/hooks/use-disable-clicking";

const FeedbackBox = () => {
  const {handleSetMutatingState}=useDisableClicking()
  const router = useRouter();

  const { mutate: sendFeedback,isPending:isSendingRequest, isSuccess } =
    trpc.feedback.createFeedback.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
      },
    });
  const [isOpenFeedbackBox, setIsOpenFeedbackBox] = useState(false);
  const [feedbackOptions, setFeedbackOptions] = useState<
    | NonNullable<NonNullable<Feedback["feedbackOptions"]>[number]["options"]>[]
    | null
  >([]);
  const toggleOpenFeedbackBox = () => setIsOpenFeedbackBox((prev) => !prev);
  const [feedbackText, setFeedbackText] = useState("");
  const handleSendFeedback = () => {
    sendFeedback({ feedback: feedbackText, feedbackOptions });
  };

  let content = (
    <>
      <p data-cy='feedback-request-title' className='font-bold'>
        Nếu bạn không hài lòng hoặc có góp ý, xin vui lòng góp ý để chúng tôi
        cải thiện tốt hơn xin cảm ơn.{" "}
      </p>
      <button
      disabled={isSendingRequest}
        data-cy='open-feedback-box-btn'
        className='mt-2 text-primary'
        onClick={toggleOpenFeedbackBox}
      >
        Góp ý cho chúng tôi
      </button>
      {isOpenFeedbackBox && (
        <div data-cy='feedback-box-details' className='mt-4'>
          <p data-cy='title-feedback-box' className='font-bold mb-2'>
            Góp ý
          </p>
          <div className='rounded-sm border space-y-2 border-gray-800 py-2 px-3'>
            <div
              data-cy='pre-filled-feedback-option'
              className='flex items-center gap-2'
            >
              <Checkbox
              disabled={isSendingRequest}
                onCheckedChange={(checked) => {
                  // setFeedbackOptions('')
                  checked
                    ? setFeedbackOptions((prev) => [
                        ...prev!,
                        "delivery-faster",
                      ])
                    : setFeedbackOptions((prev) =>
                        prev!.filter((val) => val !== "delivery-faster")
                      );
                }}
                id='delivery-faster'
              />
              <Label htmlFor='delivery-faster'>Cần giao hàng nhanh hơn</Label>
            </div>
            <div
              data-cy='pre-filled-feedback-option'
              className='flex items-center gap-2'
            >
              <Checkbox
              disabled={isSendingRequest}
                onCheckedChange={(checked) => {

                  checked
                    ? setFeedbackOptions((prev) => [
                        ...prev!,
                        "better-serve-attitude",
                      ])
                    : setFeedbackOptions((prev) =>
                        prev!.filter((val) => val !== "better-serve-attitude")
                      );
                }}
                id='better-serve-attitude'
              />
              <Label htmlFor='better-serve-attitude'>
                Cần thái độ phục vụ tốt hơn
              </Label>
            </div>
          </div>
          <p className='text-sm text-muted-foreground mt-2 mb-4'>
            Hoặc quý khác hàng có những góp y khác vui lòng góp ý ở dưới đây
          </p>
          <div>
            <Textarea
              data-cy='feedback-text-area'
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
              className='placeholder:italic placeholder:text-muted-foreground'
              placeholder='Mọi sự góp ý đều được chúng tôi ghi nhận và sẵn sàng sửa đổi và cải thiện để được tốt hơn.'
            />
            <Button
            disabled={isSendingRequest}
              onClick={handleSendFeedback}
              data-cy='submit-feedback-btn'
              variant='secondary'
              className='mt-4 block w-full md:w-auto'
            >
              {isSendingRequest ?"Đang góp ý...":"Góp ý"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
  const isMutating=isSendingRequest
  useEffect(()=>{
    if(isMutating){
      handleSetMutatingState(true)
    }
    if(!isMutating){
      handleSetMutatingState(false)
  
    }
  },[isMutating,handleSetMutatingState])

  if (isSuccess) {
    content = (
      <p data-cy='thank-for-feedback' className='font-bold'>
        Cảm ơn bạn đã góp ý. Chúng tôi sẽ cố gắng cải thiện chất lượng dịch vụ.
      </p>
    );
  }
  return <div className='my-6'>{content}</div>;
};

export default FeedbackBox;
