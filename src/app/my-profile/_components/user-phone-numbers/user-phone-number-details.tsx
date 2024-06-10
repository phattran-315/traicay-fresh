import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";
import AddAdjustPhoneNumber from "../add-adjust-phone-number";
import ButtonDelete from "@/components/atoms/button-delete";
import { IUser } from "@/types/common-types";
import { isEmailUser } from "@/utils/util.utls";
import useDisableClicking from "@/hooks/use-disable-clicking";
import { useEffect } from "react";

interface UserPhoneNumberDetails extends IUser {
  expandedIndex: number;
  isDefault?: boolean;
  phoneNumber: string;
  index: number;
  id: string;
  onExpand: (index: number) => void;
}

const UserPhoneNumberDetails = ({
  onExpand,
  id,
  index,
  phoneNumber,
  isDefault,
  user,
  expandedIndex,
}: UserPhoneNumberDetails) => {
  const {handleSetMutatingState}=useDisableClicking()
  const router = useRouter();
  const {
    isPending: isUpdatingDefaultPhoneNumber,
    mutate: setDefaultPhoneNumber,
  } = trpc.user.setDefaultPhoneNumber.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });
  const { isPending: isDeletingPhoneNumber, mutate: deletePhoneNumber } =
    trpc.user.deletePhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
      },
    });
  const {
    isPending: isDeletingPhoneNumberUserNumber,
    mutate: deletePhoneNumberUserNumber,
  } = trpc.customerPhoneNumber.deletePhoneNumber.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });
  const handleDeleteUserPhoneNumber = () => {
    if (isEmailUser(user!)) {
      deletePhoneNumber({
        id: id!,
      });
      return;
    }
    deletePhoneNumberUserNumber({ id });
  };
const isMutating=isDeletingPhoneNumber||isDeletingPhoneNumberUserNumber||isUpdatingDefaultPhoneNumber
useEffect(()=>{
  if(isMutating){
    handleSetMutatingState(true)
  }
  if(!isMutating){
    handleSetMutatingState(false)

  }
},[isMutating,handleSetMutatingState])
  return (
    <li
      data-cy='user-phone-number-item'
      key={phoneNumber}
      className={cn(
        "w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis",
        {
          block: index === expandedIndex,
        }
      )}
    >
      <div className='inline-block min-w-[150px] max-w-[250px]'>
        <div className='font-normal'>
          <div
            data-cy='user-phone-number-detail'
            className='font-bold flex flex-col'
          >
            {phoneNumber}{" "}
            {isDefault && <span className='text-xs'>(Mặc định)</span>}
          </div>
          {/* only email user allows to set default one */}
          {!isDefault && isEmailUser(user!) && (
            <button
              onClick={() =>
                setDefaultPhoneNumber({
                  phoneNumber: phoneNumber,
                  id: id!,
                })
              }
              data-cy='set-default-phone-number-btn'
              disabled={isMutating}
              className={cn("text-xs text-primary", {
                "text-primary/80": isUpdatingDefaultPhoneNumber,
              })}
            >
              Đặt làm mặc định
            </button>
          )}
        </div>
      </div>

      {isEmailUser(user!) || !isDefault ? (
        <AddAdjustPhoneNumber
          user={user}
          index={index}
          id={id}
          onExpand={onExpand}
          isExpanded={index === expandedIndex}
          type='adjust'
          phoneAdjust={phoneNumber}
        />
      ) : null}

      {!isDefault && expandedIndex !== index && (
        <>
          <ButtonDelete
            onClick={handleDeleteUserPhoneNumber}
            className='ml-4'
            disabled={isMutating}
          />
        </>
      )}
    </li>
  );
};

export default UserPhoneNumberDetails;
