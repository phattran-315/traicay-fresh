import { sortIsDefaultFirst } from "@/utils/util.utls";
import { useMemo } from "react";
import { UserPhoneNumberProps } from ".";
import UserPhoneNumberDetails from "./user-phone-number-details";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import { IUser } from "@/types/common-types";

interface UserPhoneNumberListProps extends IUser{
  
  phoneNumbers: Customer["phoneNumbers"] | CustomerPhoneNumber["phoneNumbers"];
  expandedIndex: number;
  onExpand: (index: number) => void;
}

const UserPhoneNumberList = ({
  phoneNumbers,
  user,
  expandedIndex,
  onExpand,
}: UserPhoneNumberListProps) => {
  const sortedPhoneNumber = useMemo(() => {
    if (phoneNumbers) {
      return sortIsDefaultFirst(phoneNumbers);
    }
    return [];
  }, [phoneNumbers]);
  return (
    <ul data-cy='phone-number-list-my-profile' className='w-full space-y-2'>
      {sortedPhoneNumber?.map((number, i) => {
        const phoneNumber = number.phoneNumber;
        return (
          <UserPhoneNumberDetails
            key={number.id}
            id={number.id!}
            user={user}
            index={i}
            onExpand={onExpand}
            expandedIndex={expandedIndex}
            phoneNumber={phoneNumber}
            isDefault={number.isDefault!}
          />
        );
      })}
    </ul>
  );
};

export default UserPhoneNumberList;
