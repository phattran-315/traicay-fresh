import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import {
  getProduct,
  getProducts,
} from "@/services/server/payload/products.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
// export const generateStaticParams = async () => {
//   const { data: products } = await getProducts();
//   const ids = (products || []).map((product) => ({ id: product.id }));
//   return ids;
// };
export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const { id } = params;
  const { data: product } = await getProduct({ id });
  if (!product) notFound();
  return {
    title: `${product.title} | TraiCayFresh`,
  };
};

const ProductDetailLayoutPage = async ({
  children,
  params,
}: Readonly<{
  params: { id: string };
  children: React.ReactNode;
}>) => {
  const { id } = params;
  const { data: product } = await getProduct({ id });
  if (!product) notFound();
  return (
    <section>
      <BreadCrumbLinks
        links={[
          { label: product.title, href: `${APP_URL.products}/${product.id}` },
        ]}
      />

      {children}
    </section>
  );
};

export default ProductDetailLayoutPage;
