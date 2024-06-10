import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/common-types";
import { sortArrayById, sortIsDefaultFirst } from "@/utils/util.utls";
import { useEffect, useMemo, useState } from "react";
import { IoCaretDownOutline } from "react-icons/io5";
import CheckoutAddressDetails from "./checkout-address-details";
import { CheckoutAddressProps } from ".";

export interface CheckoutAddressListProps
  extends IUser,
    Pick<
      CheckoutAddressProps,
      "onSetShippingAddress" | "currentShippingAddressId"
    > {
  onExpand: (state: boolean) => void;
  isFormAddExpanded: boolean;
}
const CheckoutAddressList = ({
  isFormAddExpanded,
  onExpand,
  currentShippingAddressId,
  onSetShippingAddress,
  user,
}: CheckoutAddressListProps) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isExpandList, setIsExpandList] = useState(false);
  const handleOpenExpandedIndex = (index: number) => {
    // if open adjust form close the add new one
    setExpandedIndex(index);
    // close the form add if we open the adjust address form
    onExpand(false);
  };
  const openAddressList = () => setIsExpandList(true);
  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return currentShippingAddressId
        ? sortArrayById(user.address, currentShippingAddressId)
        : sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address, currentShippingAddressId]);
  // if the form add is open close the adjust address form
  useEffect(() => {
    if (isFormAddExpanded) {
      setExpandedIndex(-1);
    }
  }, [isFormAddExpanded]);
  // default set the default one
  return (
    <ul
      data-cy='user-address-list-checkout'
      className='bg-gray-200 rounded-md py-3 px-2 space-y-2 sm:px-4'
    >
      <RadioGroup
        defaultValue={sortedAddress![0].id!}
        value={currentShippingAddressId || sortedAddress![0].id!}
      >
        {sortedAddress!
          ?.slice(0, !isExpandList ? 1 : sortedAddress.length)!
          .map((ad, i) => (
            // <Fragment key={ad.id} sty >
            <CheckoutAddressDetails
              onSetShippingAddress={onSetShippingAddress}
              key={ad.id}
              currentIndex={expandedIndex}
              isExpandedAddressList={isExpandList}
              index={i}
              onExpand={handleOpenExpandedIndex}
              user={user}
              {...ad!}
              userAddressId={ad.id!}
              id={ad.id!}
              isDefault={ad.isDefault!}
            />
          ))}
      </RadioGroup>
      <div className='grid grid-cols-[20px_1fr] mt-4 gap-3'>
        <div className='col-start-2 text-primary text-sm flex gap-2 items-center'>
          {/* more than 1 addresses */}
          {sortedAddress!.length > 1 && !isExpandList && (
            <>
              <button
                data-cy='expand-address-btn-checkout'
                onClick={openAddressList}
                className='flex items-center gap'
              >
                Xem thêm {sortedAddress!.length - 1} địa chỉ
                <IoCaretDownOutline />{" "}
              </button>

              {!isFormAddExpanded && (
                <span className='text-gray-800 text-xs'>Hoặc</span>
              )}
            </>
          )}
          {!isFormAddExpanded && (
            <button
              data-cy='add-new-address-btn-checkout'
              onClick={() => onExpand(true)}
            >
              Thêm địa chỉ mới
            </button>
          )}
        </div>
      </div>
    </ul>
  );
};

export default CheckoutAddressList;
