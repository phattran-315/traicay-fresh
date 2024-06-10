import CartList from "@/components/molecules/cart-list";
import { getCartOfUser } from "@/services/server/payload/carts.service";
import { getUserServer } from "@/services/server/payload/users.service";
import CartSummary from "./_components/cart-summary";
import { cookies } from "next/headers";


const CartPage = async () => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;

  const { data: userCart } = await getCartOfUser(
    user && "email" in user ? "email" : "phoneNumber",
    user?.id
  );


  return (
    <div className="md:flex md:gap-8">
      <CartList user={user} userCart={userCart!} />
      <CartSummary user={user} />
    </div>
  );
};

export default CartPage;
