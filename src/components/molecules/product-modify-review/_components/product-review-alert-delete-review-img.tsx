import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { PropsWithChildren } from "react"

interface ProductReviewAlertDeleteReviewImgProps extends PropsWithChildren{
    isOpen:boolean
    isMutating:boolean
    onToggleOpenState:()=>void
    onDeleteImgServer:()=>void
}
const ProductReviewAlertDeleteReviewImg = ({isMutating,isOpen,onToggleOpenState,children,onDeleteImgServer}:ProductReviewAlertDeleteReviewImgProps) => {
  return (
    <AlertDialog open={isOpen}>
    <AlertDialogTrigger asChild>
    {children}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Bán có muốn xóa ảnh này?</AlertDialogTitle>
        {/* <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription> */}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onToggleOpenState}>Hủy</AlertDialogCancel>
          <Button onClick={()=>{
            onDeleteImgServer()
          }} variant='destructive'>{!isMutating?"Xóa":"Đang xóa"}</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>)
}

export default ProductReviewAlertDeleteReviewImg