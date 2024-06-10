import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";

import { getCartOfUser } from "@/services/server/payload/carts.service";

import Link from "next/link";
import HeaderCartItem from "./header-cart-item";
import { cookies } from "next/headers";



const HeaderCart = async () => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;
  const {data:userCart} = await getCartOfUser(user && 'email' in user?'email':'phoneNumber',user?.id)||[];
  return (
    <Link data-cy='header-cart-link' href={APP_URL.cart} className='relative'>
      <HeaderCartItem userCart={userCart||[]} />
    </Link>
  );
};

export default HeaderCart;
