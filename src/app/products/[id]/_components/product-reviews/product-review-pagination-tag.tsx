import { cn } from "@/lib/utils";
import React from "react";
interface ProductReviewPaginationProps {
  sortedPages: number[];
  currentPage: number;
  onSetPagination: (page: number) => void;
}
const ProductReviewPagination = ({
  sortedPages,
  currentPage,
  onSetPagination,
}: ProductReviewPaginationProps) => {
  return (
    <ul className='flex gap-3 mt-12 justify-center'>
      {sortedPages.map((page) => {
        if (page) {
          return (
            <ProductReviewPaginationTag
              index={page}
              key={page}
              active={page === currentPage}
              onSetPagination={onSetPagination}
            />
          );
        }
      })}
    </ul>
  );
};

type ProductReviewPaginationTagProps = Pick<
  ProductReviewPaginationProps,
  "onSetPagination"
> & { active: boolean; index: number };
const ProductReviewPaginationTag = ({
  onSetPagination,
  active,
  index,
}: ProductReviewPaginationTagProps) => {
  return (
    <li>
      <button
        onClick={() => onSetPagination(index)}
        className={cn(
          "rounded-sm bg-gray-200 h-10 py-2.5 px-3 text-xs border flex items-center hover:border-primary",
          {
            "border-primary": active,
          }
        )}
      >
        {index}
      </button>
    </li>
  );
};

export default ProductReviewPagination;
