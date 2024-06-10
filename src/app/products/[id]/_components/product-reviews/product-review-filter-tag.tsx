import { cn } from "@/lib/utils";
import { IoStar } from "react-icons/io5";
interface ProductReviewFilterTag{
  label: string;
  index: number;
  option:number,
  active:boolean
  onSetFilter:(filter:number)=>void
}
const ProductReviewFilterTag = ({
  label,
  option,
  active,
  index,
  onSetFilter,
}:ProductReviewFilterTag ) => {
  return (
    <li className='flex-1'>
      <button onClick={()=>onSetFilter(option)} className={cn('whitespace-nowrap w-full text-sm px-2 py-1.5 flex-center gap-1.5 border rounded-sm hover:border-primary',{
        'border-primary':active
      })}>
        {index !== 0 ? (
          <>
            {label} <IoStar className='w-4 h-4 text-secondary' />{" "}
          </>
        ) : (
          label
        )}
      </button>
    </li>
  );
};
export default ProductReviewFilterTag;
