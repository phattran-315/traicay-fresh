import UserAddressDetails, {
  UserAddressDetailsProps,
} from "@/components/molecules/user-address-details";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CheckoutAddressProps } from ".";
import { formUserAddress } from "@/utils/util.utls";

interface CheckoutAddressDetailsProps
  extends UserAddressDetailsProps,
    Pick<CheckoutAddressProps, "onSetShippingAddress"> {
  currentIndex: number;
  isExpandedAddressList: boolean;
  onExpand: (index: number) => void;
  name: string;
  phoneNumber: string;
  isDefault: boolean;
  userAddressId:string
}
const CheckoutAddressDetails = (props: CheckoutAddressDetailsProps) => {
  const { district, ward, street, name, phoneNumber, onSetShippingAddress,userAddressId } =
    props;
  return (
    <div
      data-cy='user-address-details-checkout'
      className={cn("grid grid-cols-[20px_1fr] gap-3 items-start py-2", {
        "animate-in fade-in slide-in-from-top-2":
          props.isExpandedAddressList && props.index > 0,
      })}
    >
      <RadioGroupItem
        onClick={() => {
          onSetShippingAddress({
            address: formUserAddress({ street, ward, district }),
            userName: name,
            userPhoneNumber: phoneNumber,
            id:userAddressId
          });
        }}
        data-cy='user-address-radio-checkout'
        className='mt-8'
        value={props.id}
        id={`address-item-${props.id}`}
      />
      <UserAddressDetails {...props} />
    </div>
  );
};

export default CheckoutAddressDetails;
