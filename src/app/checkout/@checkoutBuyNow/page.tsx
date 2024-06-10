import { getUserServer } from "@/services/server/payload/users.service";

import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { getProduct } from "@/services/server/payload/products.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutClientBuyNow from "../_components/checkout-client-buy-now";

const CheckoutCartPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const productId = searchParams[APP_PARAMS.productId];
  if (!productId) redirect(APP_URL.checkout);
  const { data: product } = await getProduct({ id: productId as string });
  if (!product) redirect(APP_URL.checkout);
  const cookie = cookies();
  const user = await getUserServer(cookie)!;

  if (!user) redirect(APP_URL.login);

  return (
    <>
      <CheckoutClientBuyNow user={user} product={product} />
    </>
  );
};

export default CheckoutCartPage;
