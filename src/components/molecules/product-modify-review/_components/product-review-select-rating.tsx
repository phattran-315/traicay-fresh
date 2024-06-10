import ErrorMsg from '@/components/atoms/error-msg';
import React from 'react'
import { IoStar, IoStarOutline } from 'react-icons/io5';

const ratings = Array.from({ length: 5 }).map((_, i) => i + 1);
interface ProductReviewSelectRatingProps{
    selectedRating:number,
    onSelectRating:(rating:number)=>void
    formStateRating?:string[]|undefined
}
const ProductReviewSelectRating = ({formStateRating,selectedRating,onSelectRating}:ProductReviewSelectRatingProps) => {
  return (
    <div>
    <ul className='flex gap-2 justify-center '>
    {ratings.map((_, index) => (
      <li className='cursor-pointer' key={index}>
        {index + 1 <= selectedRating ? (
          <IoStar
            onClick={() => onSelectRating(index + 1)}
            className='text-secondary'
            size={30}
          />
        ) : (
          <IoStarOutline
            onClick={() => onSelectRating(index + 1)}
            className='text-secondary'
            size={30}
          />
        )}
      </li>
    ))}
  </ul>
     {formStateRating && !selectedRating && (
        <div className='flex justify-center mt-2'>
          <ErrorMsg msg={formStateRating[0]} />
        </div>
      )}
    </div>

  )
}

export default ProductReviewSelectRating