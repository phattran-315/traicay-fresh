import ProductModifyReview from "@/components/molecules/product-modify-review";
import PageSubTitle from "@/components/ui/page-subTitle";
import { Product, Review } from "@/payload/payload-types";
import { getUserOrdersNoPopulate } from "@/services/server/payload/orders.service";
import {
  checkUserHasReviewed,
  getProductReviews,
} from "@/services/server/payload/reviews.service";
import { IUser } from "@/types/common-types";
import ProductReviewList from "./product-review-list";
import ProductReviewOfUser from "./product-reviewed-of-user";

interface ProductReviewsProps extends IUser {
  productId: string;
  productTitle: string;
  productImgSrc: Product["thumbnailImg"];
}
const ProductReviews = async ({
  user,
  productId,
  productImgSrc,
  productTitle,
}: ProductReviewsProps) => {
  let hasBoughtProduct = false;
  let hasReviewedProduct = false;
  let userReview: Review;
  if (user) {
    // check if user bought the product before
    const { data: userOrder } = await getUserOrdersNoPopulate({
      userId: user.id,
    });
    if (!userOrder) hasBoughtProduct = false;
    const userOrders = userOrder?.orders;
    if (!userOrders) hasBoughtProduct = false;
    if (
      userOrders?.some((order) => {
        return (
          // TODO: production later
          // order._isPaid &&
          order.items.find((item) => item.product === productId)
        );
      })
    ) {
      hasBoughtProduct = true;
    }
    // check if user reviewed the product
    const { data: userReviewData } = await checkUserHasReviewed({
      userId: user.id,
      productId,
    });
    if (userReviewData) {
      hasReviewedProduct = true;
      // only 1 review on 1 product per user
      userReview = userReviewData[0];
    }
  }
  // get first 5 reviews in server
  const {data:reviewsResult} = await getProductReviews({ productId, limit: 5 });
  const first5Reviews=reviewsResult?.reviews
  const totalPages=reviewsResult?.totalPages
  // TODO: is loading
  return (
    <div id='reviews' className='my-12 md:my-16'>
      <PageSubTitle className='mb-2'>Đánh giá sản phẩm:</PageSubTitle>
      {!hasBoughtProduct && (
        <div className='mt-6'>
          <p className='font-semibold text-center mb-4 md:text-start'>
            Mua hàng để đánh giá sản phẩm
          </p>
        </div>
      )}
      {hasBoughtProduct && !hasReviewedProduct && (
        <>
          <div className='mt-6'>
            <p className='font-semibold text-center mb-4 md:text-start'>
              Cảm ơn bạn đã mua hàng gửi đánh giá giúp bọn mình nhé
            </p>
          </div>

          <div className='flex justify-center mb-6 md:justify-start'>
            <ProductModifyReview
              user={user}
              productId={productId}
              title={productTitle}
              imgSrc={productImgSrc}
            />
          </div>
        </>
      )}
      {hasReviewedProduct && (
        <ProductReviewOfUser
          productId={productId}
          user={user}
          productThumbnailImg={productImgSrc}
          title={productTitle}
          reviewId={userReview!.id}
          userName={user?.name || `User ${user?.id.slice(-6)}`}
          userReviewText={userReview!.reviewText || ""}
          userReviewImgs={userReview!.reviewImgs}
          userRating={userReview!.rating}
        />
      )}
      {/* filter */}

      <ProductReviewList user={user} totalPages={totalPages} initialReviews={first5Reviews||[]} productId={productId} />
    </div>
  );
};

export default ProductReviews;
