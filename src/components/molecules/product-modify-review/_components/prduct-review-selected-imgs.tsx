import ErrorMsg from "@/components/atoms/error-msg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";
import { ISelectedImg } from "..";
import ProductInspectReviewImg from "./inspect-img";
import ProductReviewAlertDeleteReviewImg from "./product-review-alert-delete-review-img";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/trpc-client";
import useDisableClicking from "@/hooks/use-disable-clicking";
import { Review } from "@/payload/payload-types";
import { handleTrpcErrors } from "@/utils/error.util";
import { useRouter } from "next/navigation";

interface ProductReviewSelectedImgsProps {
  selectedImgs: ISelectedImg[];
  onRemoveReviewImg: (id: string) => void;
  type?: "add" | "adjust";
  formStateImgs?: string[] | undefined;
  reviewId: Review["id"];
  userSelectedImgs: ISelectedImg[] | undefined;
}
const ProductReviewSelectedImgs = ({
  selectedImgs,
  onRemoveReviewImg,
  type = "add",
  userSelectedImgs,
  formStateImgs,
  reviewId,
}: ProductReviewSelectedImgsProps) => {
  const router = useRouter();
  const { handleSetMutatingState } = useDisableClicking();
  const [isOpenConfirmDeleteImg, setIsOpenConfirmDeleteImg] = useState(false);
  const handleToggleOpenState = () =>
    setIsOpenConfirmDeleteImg((prev) => !prev);

  const { mutateAsync: deleteReviewImg, isPending: isDeletingImg } =
    trpc.review.deleteReviewImg.useMutation();
  useEffect(() => {
    if (isDeletingImg) {
      handleSetMutatingState(true);
    }
    if (!isDeletingImg) {
      handleSetMutatingState(false);
    }
  }, [handleSetMutatingState, isDeletingImg]);
  const deleteReviewImgServer = async (id: string) => {
    if (type === "adjust") {
      if (userSelectedImgs?.find((img) => img.id === id)) {
        await deleteReviewImg({ imgId: id, reviewId: reviewId! }).catch((err) =>
          handleTrpcErrors(err)
        );
      }
      onRemoveReviewImg(id);
      handleToggleOpenState();
      router.refresh();
    }
  };
 
  return (
    <>
      <div className='flex gap-2'>
        {selectedImgs.map((img, index) => (
          <div key={index} className='w-20 h-20 relative'>
            <ProductInspectReviewImg>
              <Image
                src={
                  typeof img.img === "string"
                    ? img.img
                    : URL.createObjectURL(img.img)
                }
                fill
                className='object-fit object-cover'
                alt='review img'
              />
            </ProductInspectReviewImg>
            {type === "add" && (
              <DeleteImgBtn
                id={img.id}
                onRemoveReviewImg={onRemoveReviewImg}
                onToggleOpenState={handleToggleOpenState}
                type={type}
              />
            )}
            {type === "adjust" && (
              <ProductReviewAlertDeleteReviewImg
                onDeleteImgServer={() => {
                  return deleteReviewImgServer.call(null, img.id);
                }}
                isMutating={isDeletingImg}
                isOpen={isOpenConfirmDeleteImg}
                onToggleOpenState={handleToggleOpenState}
              >
                <DeleteImgBtn
                  id={img.id}
                  onRemoveReviewImg={onRemoveReviewImg}
                  onToggleOpenState={handleToggleOpenState}
                  type={type}
                />
              </ProductReviewAlertDeleteReviewImg>
            )}
          </div>
        ))}
      </div>
      {formStateImgs && selectedImgs.length > 0 && (
        <div className='mt'>
          <ErrorMsg msg={formStateImgs[0]} />
        </div>
      )}
    </>
  );
};

export default ProductReviewSelectedImgs;

interface DeleteImgBtnProps
  extends Pick<ProductReviewSelectedImgsProps, "onRemoveReviewImg" | "type"> {
  onToggleOpenState(): void;
  id: string;
}
function DeleteImgBtn({
  type,
  onRemoveReviewImg,
  onToggleOpenState,
  id,
}: DeleteImgBtnProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <button
      type='button'
      onClick={() => {
        if (type === "add") {
          onRemoveReviewImg(id);
        }
        if (type === "adjust") {
          onToggleOpenState();
        }
      }}
      className={cn(
        "absolute top-[5%]  right-[5%] flex-center rounded-full cursor-pointer bg-gray-300 hover:bg-gray-400",
        {
          "w-5 h-5": !isDesktop,
          "w-6 h-6": isDesktop,
        }
      )}
    >
      <IoCloseOutline />
      {/* {type==='adjust' && <ProductReviewAlertDeleteReviewImg onToggleOpenState={handleToggleOpenState} isOpen={isOpenConfirmDeleteImg} />} */}
    </button>
  );
}
