import { cn } from "@/lib/utils";
import React from "react";
import { IoStar, IoStarOutline, IoStarHalf } from "react-icons/io5";
const ratings = Array.from({ length: 5 }).map((_, i) => i + 1);
interface ReviewRatingProps {
  ratingAverage: number;
  reviewQuantity?: number;
  className?:string
  
}
const ReviewRating = ({className, reviewQuantity, ratingAverage }: ReviewRatingProps) => {
  const fullStars = Math.floor(ratingAverage);
  const hasHalfStar = ratingAverage % 1 !== 0;

  return (
    <div className={cn("flex gap-2 items-center",className)}>
      <ul className='flex gap items-center gap'>
      {ratings.map((rating) => {
        if (rating <= fullStars) {
          return <li key={rating}><IoStar className="text-secondary" /></li>;
        } else if (rating === fullStars + 1 && hasHalfStar) {
          return <li key={rating}><IoStarHalf className="text-secondary" /></li>;
        } else {
          return <li key={rating}><IoStarOutline className="text-secondary" /></li>;
        }
      })}
    </ul>
   {reviewQuantity &&  <p className="text-xs">({reviewQuantity})</p>}
    </div>
  );
};

export default ReviewRating;
