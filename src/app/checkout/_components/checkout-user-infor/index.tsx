import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";

const CheckoutUserInfo = () => {
  return (
    <div>
      <PageSubTitle>Thông tin khách hàng</PageSubTitle>

      <div className='flex items-center gap-4'>
        <div data-cy='name-box-checkout' className="flex-1">
          <Label className="mb-2 block" htmlFor='name'>Họ và tên</Label>
          <Input placeholder='Họ và tên' id='name' />
        </div>
        <div data-cy='phone-number-box-checkout' className="flex-1">
          <Label className="mb-2 block" htmlFor='name'>Số điện thoại</Label>
          <Input placeholder='Số điện thoại' id='name' />
        </div>
      </div>
    </div>
  );
};

export default CheckoutUserInfo;
