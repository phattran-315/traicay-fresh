
import CartList from "@/components/molecules/cart-list";
import PageSubTitle from "@/components/ui/page-subTitle";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import { getCartOfUser } from "@/services/server/payload/carts.service";

import { IUser } from "@/types/common-types";
import { isEmailUser } from "@/utils/util.utls";


interface CheckoutListCartProps extends IUser{
}
const CheckoutListCart = async ({user}:CheckoutListCartProps) => {
  const {data:userCart} =
    (await getCartOfUser(
      user && isEmailUser(user) ? "email" : "phoneNumber",
      user?.id
    )) || [];
  return (
    <div className="mt-8">
      <PageSubTitle>Sản phẩm</PageSubTitle>
       <CartList user={user || undefined} userCart={userCart!} />
    </div>
  );
};

export default CheckoutListCart;
