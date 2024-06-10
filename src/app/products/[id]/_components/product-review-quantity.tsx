"use client";

const ProductReviewQuantity = ({ quantity }: { quantity: number }) => {
  return (
    <button
      onClick={() => {
        document
          .querySelector("#reviews")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      className='text-primary font-bold'
    >
      {quantity} đánh giá
    </button>
  );
};
export default ProductReviewQuantity;
