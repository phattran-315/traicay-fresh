import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";
import HeaderCart from "./header-cart/header-cart";
import HeaderNavMobile from "./header-nav-mobile";
import MaxWidthWrapper from "@/components/molecules/max-width-wrapper";
import HeaderNavDesktop from "./header-nav-desktop";
import { cookies } from "next/headers";

const Header = async () => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;

  return (
    <header className='shadow bg-primary/60 md:shadow-md'>
        <MaxWidthWrapper className="h-20 px-6 flex justify-between items-center md:px-12">
        {/* Logo */}
        <Link data-cy='header-logo' href={APP_URL.home}>
          <h2>Logo</h2>
        </Link>
          <HeaderNavDesktop user={user} />

        <div className='flex gap-4 h-full items-center'>
        
         <Link href={APP_URL.myProfile}>
            <IoPersonOutline className='w-7 h-7 text-gray-800 hover:text-gray-800' />
          </Link>
          <HeaderCart />
          <HeaderNavMobile user={user} />
        </div>
    </MaxWidthWrapper>
      </header>
  );
};

export default Header;
