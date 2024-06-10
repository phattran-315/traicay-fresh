import { Textarea } from '@/components/ui/textarea'
import React from 'react'
interface ProductReviewText{
    reviewText:string,
    onChangeReviewText:(reviewText:string)=>void
}
const ProductReviewText = ({reviewText,onChangeReviewText}:ProductReviewText) => {
  return (
    <div>
        <Textarea
          data-cy='feedback-text-area'
          value={reviewText}
          name='reviewText'
          onChange={(e) => onChangeReviewText(e.target.value)}
          rows={5}
          className='placeholder:italic placeholder:text-muted-foreground'
          placeholder='Mời bạn đánh giá.'
        />
      </div>
  )
}

export default ProductReviewText