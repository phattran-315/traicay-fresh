import { getProducts } from "@/services/server/payload/products.service";
import ProductList from "../(home)/_components/product-list";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";

const Products = async () => {
  const { data: products } = await getProducts();
  return (
    <>
      <BreadCrumbLinks
        links={[{ label: "Tất cả sản phẩm", href: APP_URL.products }]}
      />
      <PageTitle>Tất cả sản phẩm</PageTitle>
      <ProductList products={products!} />
    </>
  );
};

export default Products;
