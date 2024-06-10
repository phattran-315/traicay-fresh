"use client";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import ProductReviewDetails from "./product-review-details";
import ProductReviewFilterTag from "./product-review-filter-tag";
import { useEffect, useState } from "react";
import ProductReviewPaginationTag from "./product-review-pagination-tag";
import { Review } from "@/payload/payload-types";
import ProductReviewPagination from "./product-review-pagination-tag";
interface ProductReviewListProps extends IUser {
  productId: string;
  totalPages?: number;
  initialReviews?: Review[];
}
const LOAD_FROM_PAGE = 2;
const reviewFilter: { label: string; option: number }[] = [
  { label: "Tất cả", option: 0 },
  { label: "5", option: 5 },
  { label: "4", option: 4 },

  { label: "3", option: 3 },

  { label: "2", option: 2 },

  { label: "1", option: 1 },
];

const ProductReviewList = ({
  productId,
  user,
  totalPages,
  initialReviews,
}: ProductReviewListProps) => {
  const pages = totalPages || 1;
  const [productReviews, setProductsReview] = useState(initialReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [lastPage, setLastPage] = useState(pages > 5 ? 5 : pages);

  const mappedPages = Array.from({
    length: pages > 5 && lastPage < pages ? 5 : Math.min(5, pages),
  }).map((_, i) => {
    const pageNumber = startPage + i;
    if (pageNumber <= pages) {
      return pageNumber;
    } else {
      return pages - i; // Adjust the page number to stay within the valid range
    }
  });
  const sortedPages =
    lastPage + 1 > pages
      ? mappedPages.slice().sort((a, b) => a - b)
      : mappedPages;
  const [currentSelectedFilter, setCurrentSelectedFilter] = useState(0);
  const handleSetPage = (page: number) => {
    if (page >= 4 && !(lastPage + 1 > pages)) {
      // If current page is 4 or greater and there are more pages ahead
      setStartPage(page - 2);
      setLastPage(Math.min(page + 2, pages)); // Ensure lastPage doesn't exceed total pages
    }

    if (page < currentPage && currentPage >= 4) {
      // If going back and current page is 4 or greater
      setLastPage(page + 2);
      setStartPage(Math.max(page - 2, 1)); // Ensure startPage doesn't go below 1
    }

    if (lastPage > pages) {
      // If lastPage exceeds total pages, adjust it
      setLastPage(pages);
    }

    setCurrentPage(page);
  };
  const handleSetFilter = (filter: number) => setCurrentSelectedFilter(filter);
  const {
    data: result,
    isLoading,
    refetch,
  } = trpc.review.getProductReviews.useQuery(
    {
      productId,
      // get from page 2
      page: currentPage,
    },
    { enabled: false }
  );

  const filteredReview =
    currentSelectedFilter === 0
      ? productReviews
      : productReviews?.filter(
          (review) => review.rating === currentSelectedFilter
        );
  useEffect(() => {
    if (result?.productReviews) {
      setProductsReview(result.productReviews);
    }
  }, [result?.productReviews]);
  useEffect(() => {
    if (currentPage >= LOAD_FROM_PAGE) {
      refetch();
    }
  }, [currentPage, refetch]);

  {
  }

  if (!isLoading && !productReviews?.length)
    return (
      <div>
        <p className='text-center font-bold mt-12 md:text-start'>
          Chưa có đánh giá nào cho sản phẩm này
        </p>
      </div>
    );
  return (
    <div>
      <ul className='flex flex-wrap gap-2'>
        {reviewFilter.map((filter, i) => (
          <ProductReviewFilterTag
            option={filter.option}
            onSetFilter={handleSetFilter}
            active={currentSelectedFilter === filter.option}
            key={filter.label}
            index={i}
            label={filter.label}
          />
        ))}
      </ul>
      <ul className='mt-8 space-y-8 md:space-y-12'>
        {filteredReview?.length ? (
          filteredReview?.map((review) => {
            const userName =
              typeof review.user.value === "object"
                ? review.user.value.name || "user"
                : review.user.value;
            const reviewOfUserId =
              typeof review.user.value === "object"
                ? review.user.value.id
                : review.user.value;
            return (
              <ProductReviewDetails
                reviewOfUserId={reviewOfUserId}
                user={user}
                key={review.id}
                name={userName}
                rating={review.rating}
                review={review.reviewText}
                reviewImgs={review.reviewImgs}
              />
            );
          })
        ) : (
          <p className='font-bold text-center mt-8'>Không có đánh giá nào.</p>
        )}
      </ul>
      {/* pagination */}
      <ProductReviewPagination
        onSetPagination={handleSetPage}
        currentPage={currentPage}
        sortedPages={sortedPages}
      />
    </div>
  );
};

export default ProductReviewList;
