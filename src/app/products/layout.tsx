import { getProducts } from "@/services/server/payload/products.service";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
};
const ProductsLayout = async({ children }: { children: ReactNode }) => {
await getProducts()
  return (
    <section>
    
      {children}
    </section>
  );
};

export default ProductsLayout;
