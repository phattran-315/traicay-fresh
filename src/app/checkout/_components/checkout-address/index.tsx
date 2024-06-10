import DeliveryAddress, {
  DeliveryAddressProps,
} from "@/components/molecules/delivery-address";
import UserAddressFormAdd from "@/components/molecules/user-address-form-add";
import PageSubTitle from "@/components/ui/page-subTitle";
import { IUser } from "@/types/common-types";
import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { IShippingAddress } from "../checkout-client";
import CheckoutAddressList from "./checkout-address-list";

export interface CheckoutAddressProps extends IUser, DeliveryAddressProps {
  onSetShippingAddress: (shippingAddress: IShippingAddress) => void;
  currentShippingAddressId?: string 
}

const CheckoutAddress = ({
  onSetShippingAddress,
  user,
  currentShippingAddressId,
  ...deliveryAddressProps
}: CheckoutAddressProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = (state: boolean) => setIsExpanded(state);

  const isHasAddresses = user!.address!.length > 0;

  const addNewAddressTitle = (
    <PageSubTitle className='flex items-center gap-2'>
      Thêm địa chỉ nhận hàng mới
    </PageSubTitle>
  );
  return (
    <div id='delivery-address-checkout-box'>
      <PageSubTitle className='flex items-center gap-2'>
        <IoLocationOutline /> Địa chỉ nhận hàng
      </PageSubTitle>

      {isHasAddresses && (
        <CheckoutAddressList
          currentShippingAddressId={currentShippingAddressId}
          onSetShippingAddress={onSetShippingAddress}
          isFormAddExpanded={isExpanded}
          onExpand={handleExpand}
          user={user}
        />
      )}
      {!isHasAddresses && (
        <form>
          {addNewAddressTitle}
          <DeliveryAddress {...deliveryAddressProps} />
        </form>
      )}

      {isExpanded && (
        <div>
          {addNewAddressTitle}

          <UserAddressFormAdd
            onSetShippingAddress={onSetShippingAddress}
            user={user}
            onExpand={setIsExpanded}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutAddress;
