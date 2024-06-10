import { Button, buttonVariants } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getPriorityProducts, getProducts } from "@/services/server/payload/products.service";
import Link from "next/link";
import ProductList from "./_components/product-list";
import { notFound } from "next/navigation";
import HeroSection from "./_components/hero-section";

export default async function Home() {
  const { data :products} = await getPriorityProducts();
  if(!products) notFound()
  return (
    <section>
      {/* hero */}
     <HeroSection />

      {/* products */}

      <div id="home-products">

      <PageTitle className='text-center text-3xl mb-8'>
        Tất cả sản phẩm
      </PageTitle>
      <ProductList products={products} />
      </div>
      <div className='flex justify-center mt-4'>
        <Link
          href={APP_URL.products}
          className={buttonVariants({
            variant: "link",
            size: "lg",
            className: "!text-lg !text-center",
          })}
        >
          Xem tất cả sản phẩm &rarr;
        </Link>
      </div>
      <PageTitle className='text-center text-3xl mb-4 mt-12'>
        Về chúng tôi
      </PageTitle>
      <p className='font-bold text-center'>
        Với sứ mệnh đem trái cây sạch , giá cả phải chăng đến cho mọi mà người
        tiêu dụng không cần phải lo về chất lượng.
      </p>
    </section>
  );
}
