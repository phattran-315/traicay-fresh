"use client";
import PageSubTitle from "@/components/ui/page-subTitle";
import { IUser } from "@/types/common-types";
import { useState } from "react";
import { MAX_ADDRESS_ALLOWED } from "@/constants/configs.constant";
import UserAddressList from "./user-address-list";
import UserAddressFormAdd from "@/components/molecules/user-address-form-add";

interface UserAddressProps extends IUser {}
const UserAddress = ({ user }: UserAddressProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = (state: boolean) => setIsExpanded(state);
  const userAddressCount = user!.address?.length || 0;
  return (
    <div>
      <UserAddressList
        isExpanded={isExpanded}
        onExpand={handleExpand}
        user={user}
      />
      <div className='flex flex-col gap-2'>
        {!isExpanded && (
          <>
            <button
              disabled={userAddressCount >= MAX_ADDRESS_ALLOWED}
              data-cy='add-new-address-my-profile'
              onClick={() => setIsExpanded((prev) => !prev)}
              className='text-primary text-lg self-start mt-4'
            >
              Thêm địa chỉ mới
            </button>
            {userAddressCount >= MAX_ADDRESS_ALLOWED && (
              <p className='text-muted-foreground text-sm'>
                Mỗi tài khoản chỉ được thêm {MAX_ADDRESS_ALLOWED} địa chỉ
              </p>
            )}
          </>
        )}
        {isExpanded && (
          <>
            {Boolean(user?.address?.length) && (
              <PageSubTitle className='mt-6 mb-0'>
                {" "}
                Thêm địa chỉ nhận hàng mới
              </PageSubTitle>
            )}
            <UserAddressFormAdd
              user={user}
              onExpand={handleExpand}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserAddress;
