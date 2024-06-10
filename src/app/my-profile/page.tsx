import { buttonVariants } from "@/components/ui/button";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";

import PageSubTitle from "@/components/ui/page-subTitle";
import Link from "next/link";
import Logout from "./_components/logout-btn";
import UserAddress from "./_components/user-address";
import UserEmail from "./_components/user-email";
import UserName from "./_components/user-name";
import UserPhoneNumbers from "./_components/user-phone-numbers";
import { cookies } from "next/headers";

const MyProfilePage = async () => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;

  return (
    <>
      {/* General information */}
      <div className='space-y-2 mb-4'>
        <PageSubTitle>Thông tin cá nhân</PageSubTitle>
       <div className="md:grid md:grid-cols-2">
       <UserEmail user={user} />
        <UserName user={user} />
       </div>
        <UserPhoneNumbers user={user} />
      </div>
      {/* Address */}
      <div className='space-y-2'>
        <PageSubTitle>Địa chỉ nhận hàng</PageSubTitle>
        <UserAddress user={user} />
      </div>
      {/* actions */}
      <div className='space-y-8 mt-12 flex flex-col items-center'>
        <Link
          href={APP_URL.myOrders}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full mt-6",
          })}
        >
          Đơn hàng của tôi
        </Link>
        <Logout user={user} />
      </div>
    </>
  );
};

export default MyProfilePage;
