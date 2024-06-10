import { useEffect, useMemo, useState } from "react";
import { IUser } from "@/types/common-types";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import UserAddressDetails from "@/components/molecules/user-address-details";

interface UserAddressListProps extends IUser {
  isExpanded: boolean;
  onExpand: (state: boolean) => void;
}
const UserAddressList = ({
  user,
  isExpanded,
  onExpand,
}: UserAddressListProps) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const handleOpenExpandedIndex = (index: number) => {
    // if open adjust form close the add new one
    setExpandedIndex(index);
    onExpand(false);
  };

  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address]);
  useEffect(() => {
    // if add form open close the adjust one
    if (isExpanded) {
      setExpandedIndex(-1);
    }
  }, [isExpanded]);
  return (
    <ul data-cy='user-address-list-my-profile' className='space-y-3'>
      {sortedAddress?.map((ad, i) => (
        <UserAddressDetails
          currentIndex={expandedIndex}
          index={i}
          onExpand={handleOpenExpandedIndex}
          user={user}
          key={ad.id}
          {...ad}
          id={ad.id!}
        />
      ))}
    </ul>
  );
};

export default UserAddressList;
