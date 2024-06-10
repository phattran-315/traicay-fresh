"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { cn } from "@/lib/utils";
import { handleTrpcErrors } from "@/utils/error.util";
import { isEmailUser, validateNumericInput } from "@/utils/util.utls";
import {
  IPhoneNumberValidation,
  PhoneValidationSchema,
} from "@/validations/user-infor.valiator";
import { handleTrpcSuccess } from "@/utils/success.util";
import { MAX_PHONE_NUMBER_ALLOWED } from "@/constants/configs.constant";
import { IUser } from "@/types/common-types";
import { INVALID_PHONE_NUMBER_TYPE } from "@/constants/validation-message.constant";

import ButtonAdjust from "@/components/atoms/button-adjust";
import useDisableClicking from "@/hooks/use-disable-clicking";

interface AddNewPhoneNumberProps<Type extends "add-new" | "adjust">
  extends IUser {
  type: Type | "add-new";
  phoneCount?: Type extends "adjust" ? undefined : number;
  phoneAdjust?: Type extends "adjust" ? string : undefined;
  index: number;
  id?: string | null;
  isExpanded: boolean;
  onExpand: (index: number) => void;
}

const AddAdjustPhoneNumber = <Type extends "add-new" | "adjust">({
  phoneAdjust,
  index,
  id,
  user,
  phoneCount = 0,
  onExpand,
  isExpanded,
  type = "add-new",
}: AddNewPhoneNumberProps<Type>) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPhoneNumberValidation>();
  const [phoneNumber, setPhoneNumber] = useState(phoneAdjust || "");
  const { handleSetMutatingState } = useDisableClicking();
  const router = useRouter();
  const { mutate: addNewPhoneNumber, isPending: isAddingNewPhoneNumber } =
    trpc.user.addNewPhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
        onExpand(-1);
      },
    });

  const { mutate: adjustPhoneNumber, isPending: isAdjustingPhoneNumber } =
    trpc.user.changeUserPhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        onExpand(-1);
        handleTrpcSuccess(router, data?.message);
      },
    });

  const {
    mutate: addNewPhoneNumberUserPhoneNumber,
    isPending: isAddingNewPhoneNumberUserPhoneNumber,
  } = trpc.customerPhoneNumber.addNewPhoneNumber.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
      onExpand(-1);
    },
  });
  const {
    mutate: adjustPhoneNumberUserPhoneNumber,
    isPending: isAdjustingPhoneNumberUserPhoneNumber,
  } = trpc.customerPhoneNumber.changeUserPhoneNumber.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      onExpand(-1);
      handleTrpcSuccess(router, data?.message);
    },
  });
  const validateIsNumberEntered = (e: ChangeEvent<HTMLInputElement>) => {
    if (validateNumericInput(e.target.value)) setPhoneNumber(e.target.value);
    return;
  };
  const handleAddNewPhoneNumber = handleSubmit(({ phoneNumber }) => {
    if (type === "add-new") {
      if (isEmailUser(user!)) {
        addNewPhoneNumber({ phoneNumber });
        return;
      }
      addNewPhoneNumberUserPhoneNumber({ phoneNumber });
      return;
    }
    if (id) {
      if (isEmailUser(user!)) {
        adjustPhoneNumber({ phoneNumber: phoneNumber, id });
        return;
      }
      adjustPhoneNumberUserPhoneNumber({ phoneNumber: phoneNumber, id });
    }
  });
  // if close the form delete the typed phone number
  useEffect(() => {
    if (isExpanded && type === "add-new") {
      setValue("phoneNumber", "");
    }
  }, [isExpanded, setValue, type]);
  const isMutating =
    isAddingNewPhoneNumber ||
    isAdjustingPhoneNumber ||
    isAddingNewPhoneNumberUserPhoneNumber ||
    isAdjustingPhoneNumberUserPhoneNumber;
  useEffect(() => {
    if (isMutating) {
      handleSetMutatingState(true);
    }
    if (!isMutating) {
      handleSetMutatingState(false);
    }
  }, [isMutating, handleSetMutatingState]);
  if (!isExpanded)
    return (
      <>
        {type === "add-new" ? (
          <button
            data-cy='open-phone-number-form-btn'
            disabled={phoneCount >= MAX_PHONE_NUMBER_ALLOWED}
            className={cn("text-primary mt-4", {
              "text-primary/70": phoneCount >= MAX_PHONE_NUMBER_ALLOWED,
            })}
            onClick={() => {
              onExpand(index);
            }}
          >
            Thêm số điện thoại mới
          </button>
        ) : (
          <ButtonAdjust
            disabled={phoneCount >= MAX_PHONE_NUMBER_ALLOWED}
            onClick={() => {
              onExpand(index);
            }}
          />
        )}

        {phoneCount >= MAX_PHONE_NUMBER_ALLOWED && (
          <p className='text-muted-foreground text-sm'>
            Mỗi tài khoản chỉ được thêm {MAX_PHONE_NUMBER_ALLOWED} số điện thoại
          </p>
        )}
      </>
    );
  return (
    <>
      <form
        data-cy='phone-number-form'
        className='w-full my-4'
        onSubmit={handleAddNewPhoneNumber}
      >
        <Input
          type='tel'
          value={phoneNumber}
          error={errors.phoneNumber}
          className={cn({
            "bg-slate-200": type === "adjust",
          })}
          pattern='^[0-9]*$'
          {...register("phoneNumber", {
            required: "Vui lòng nhập số điện thoại",
            onChange: (e) => {
              validateIsNumberEntered(e);
            },
            validate: (val) => {
              return (
                PhoneValidationSchema.safeParse({ phoneNumber: val }).success ||
                INVALID_PHONE_NUMBER_TYPE
              );
            },
          })}
          placeholder={
            type === "add-new" ? "Số điện thoại mới" : "Sửa số điện thoại"
          }
        />
        {errors.phoneNumber && <ErrorMsg msg={errors.phoneNumber.message} />}
        <div className='mt-4 flex gap-3'>
          <Button
            data-cy='submit-phone-number-btn'
            disabled={
              isAddingNewPhoneNumber ||
              isAdjustingPhoneNumber ||
              isAddingNewPhoneNumberUserPhoneNumber ||
              isAdjustingPhoneNumberUserPhoneNumber
            }
            className='flex-1'
          >
            {isAddingNewPhoneNumber ||
            isAdjustingPhoneNumber ||
            isAddingNewPhoneNumberUserPhoneNumber ||
            isAdjustingPhoneNumberUserPhoneNumber
              ? "Đang thêm..."
              : "Xác nhận"}
          </Button>
          <Button
            data-cy='close-phone-number-form-btn'
            onClick={() => onExpand(-1)}
            disabled={
              isAddingNewPhoneNumber ||
              isAdjustingPhoneNumber ||
              isAddingNewPhoneNumberUserPhoneNumber ||
              isAdjustingPhoneNumberUserPhoneNumber
            }
            type='button'
            className='flex-1'
            variant='destructive'
          >
            Hủy
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddAdjustPhoneNumber;
