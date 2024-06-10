import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { IoCloseOutline, IoCreateOutline } from "react-icons/io5";
import { IProductModifyReview } from "..";
import SubmitProductReviewBtn from "./submit-product-review-btn";
interface ProductReviewDesktopProps
  extends PropsWithChildren,
    Pick<IProductModifyReview, "type"> {
  createReviewAction: (payload: FormData) => void;
  isOpen: boolean;
  onToggleModalState: () => void;
  selectedRating: number;
  onSetIsSubmittingTheForm: () => void;
  isSubmitting: boolean;
}
const ProductReviewDesktop = ({
  children,
  selectedRating,
  createReviewAction,
  onSetIsSubmittingTheForm,
  isSubmitting,
  onToggleModalState,
  type,
}: ProductReviewDesktopProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn({ "!p-0": type === "adjust" })}
          onClick={onToggleModalState}
          variant={type === "add" ? "secondary-outline" : "text-primary"}
        >
          {type === "add" ? (
            <>Gửi đánh giá</>
          ) : (
            <div
              className={cn({
                "flex gap-1.5": type === "adjust",
              })}
            >
              <IoCreateOutline />
              Sửa
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>Đánh giá sản phẩm</DialogTitle>
          {/* <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription> */}
        </DialogHeader>
        <form action={createReviewAction}>
          {children}
          <SubmitProductReviewBtn
            onSetIsSubmittingTheForm={onSetIsSubmittingTheForm}
            selectedRating={selectedRating}
          />
        </form>
        {/* <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
        <DialogClose
          className='absolute top-[2%] right-[4%] cursor-pointer'
          asChild
        >
          <button
            className='hover:text-destructive'
            onClick={onToggleModalState}
            disabled={isSubmitting}
          >
            <IoCloseOutline size={30} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ProductReviewDesktop;
