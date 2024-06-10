import { Input } from '@/components/ui/input'
import { ALLOW_UPLOAD_IMG_LENGTH } from '@/constants/configs.constant';
import React, { ChangeEvent, useRef } from 'react'
import { IoCameraOutline } from 'react-icons/io5'

interface ProductReviewPickImgsProps{
    selectedImgLength:number,
    onPickImgs:(e: ChangeEvent<HTMLInputElement>)=>void
}
const ProductReviewPickImgs = ({selectedImgLength,onPickImgs}:ProductReviewPickImgsProps) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const handleOpenImgPicker = () => {
       if (selectedImgLength === ALLOW_UPLOAD_IMG_LENGTH) {
         alert("Đã upload số ảnh được quy định");
         return;
       }
       inputFileRef.current?.click();
     };
  return (
    <div>
    <label htmlFor='product-review-img'></label>
    <Input
      onChange={onPickImgs}
      ref={inputFileRef}
      type='file'
      accept='image/*'
      multiple
      id='product-review-img'
      className='hidden'
    />

    <button
      type='button'
      onClick={handleOpenImgPicker}
      className='flex text-primary items-center gap-2'
    >
      <IoCameraOutline /> Gửi ảnh đánh giá{" "}
      <span className='text-muted-foreground'>(tối đa 3 ảnh)</span>
    </button>
  </div>
  )
}

export default ProductReviewPickImgs