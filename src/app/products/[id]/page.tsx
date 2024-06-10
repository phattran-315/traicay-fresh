import PageTitle from "@/components/ui/page-title";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { getProduct } from "@/services/server/payload/products.service";
import { getUserServer } from "@/services/server/payload/users.service";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductAddToCart from "./_components/product-add-to-cart";
import ProductBenefits from "./_components/product-benefits";
import ProductBuyNow from "./_components/product-buy-now";
import ProductDescription from "./_components/product-description";
import ProductPrice from "./_components/product-price";
import QuantityOptions from "./_components/product-quantity-option";
import ProductReviewQuantity from "./_components/product-review-quantity";
import ProductReviews from "./_components/product-reviews";
import ProductSlider from "./_components/product-slider";
import RelativeProducts from "./_components/relative-products";

const ProductPage = async ({
  searchParams,
  params: { id },
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;
  const { data: product } = await getProduct({ id });
  if (!product) notFound();
  const currentQuantityOptionParams = searchParams?.currentQuantityOption;
  const currentQuantityOption =
    // do not allow buy above 16kg in the app
    currentQuantityOptionParams &&
    +currentQuantityOptionParams > 0 &&
    +currentQuantityOptionParams < 16
      ? Number(currentQuantityOptionParams)
      : 1;
  // return <ProductSkeleton />
  return (
    <>
      <PageTitle data-cy='product-title' className='mb-2'>
        {product.title} ({currentQuantityOption}KG)
      </PageTitle>
      <div className='flex gap-2'>
        <ReviewRating ratingAverage={product.ratingAverage! || 5} />
        <ProductReviewQuantity quantity={product.reviewQuantity || 1} />
      </div>
      <div className='mt-6'>
        <div className='md:flex gap-6'>
          <ProductSlider imgs={product.productImgs} />
          <div className='w-full'>
            <QuantityOptions
              currentOption={!currentQuantityOption ? 1 : currentQuantityOption}
              options={product.quantityOptions}
            />
            <div className='hidden md:block'>
              <ProductPrice
                priceAfterDiscount={product.priceAfterDiscount}
                originalPrice={product.originalPrice}
                currentQuantityOption={currentQuantityOption}
              />
            </div>
            <div className='hidden mt-4 md:flex md:items-center md:gap-4'>
              <ProductBuyNow
                quantity={currentQuantityOption}
                productId={product.id}
              />
              <ProductAddToCart
                user={user}
                product={{ ...product, quantity: currentQuantityOption }}
              />
            </div>
          </div>
        </div>
        <div className='block md:hidden'>
          <ProductPrice
            priceAfterDiscount={product.priceAfterDiscount}
            originalPrice={product.originalPrice}
            currentQuantityOption={currentQuantityOption}
          />
        </div>
      {/* <div className='block md:hidden'>
          <ProductBuyNow
            quantity={currentQuantityOption}
            productId={product.id}
          />
          <ProductAddToCart
            user={user}
            product={{ ...product, quantity: currentQuantityOption }}
          />
        </div>   */}
        <ProductDescription benefitImg={product.benefitImg} description={product.description} />
      </div>

      <ProductBenefits />

      {/* Reviews */}
      {/* use <Suspend />> */}
      {/* <ProductReview productId={product.id} title={product.title} imgSrc={product.thumbnailImg}/> */}
      <Suspense fallback={<p>Loading...</p>}>
        <ProductReviews
          productImgSrc={product.thumbnailImg}
          productTitle={product.title}
          productId={product.id}
          user={user}
        />
      </Suspense>
        <RelativeProducts products={product.relativeProducts} user={user} />
    </>
  );
};

export default ProductPage;
