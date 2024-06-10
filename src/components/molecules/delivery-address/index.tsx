"use client";
import { toast } from "sonner";
import { memo, useCallback } from "react";
import ErrorMsg from "@/components/atoms/error-msg";
import { Input } from "@/components/ui/input";
import { IAddressValidation } from "@/validations/user-infor.valiator";
import { useEffect, useRef, useState } from "react";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import DistrictAddress from "./districts-address";
import WardsAddress from "./wards-address";
import { cn } from "@/lib/utils";
import { SUPPORTED_PROVINCE } from "@/constants/configs.constant";
import UserNameAddress from "./user-name-address";
import UserPhoneNumberAddress from "./user-phone-number-address";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import {
  REQUIRED_DISTRICT,
  REQUIRED_NAME,
  REQUIRED_PHONE_NUMBER,
  REQUIRED_STREET,
  REQUIRED_WARD,
} from "@/constants/validation-message.constant";

type IErrorFieldType =
  | FieldError
  | (Record<
      string,
      Partial<{
        type: string | number;
        message: string;
      }>
    > &
      Partial<{
        type: string | number;
        message: string;
      }>);

export interface DeliveryAddressProps {
  defaultDistrictValue?: string;
  defaultWardValue?: string;
  defaultUserName?: string;
  defaultUserPhoneNumber?: string;
  register: UseFormRegister<IAddressValidation>;
  errors: FieldErrors<IAddressValidation>;
  phoneNumberList?: Customer["phoneNumbers"] |CustomerPhoneNumber['phoneNumbers'];
  onSetDistrict: (district: string) => void;

  onSetName: (userName: string) => void;
  onSetPhoneNumber: (phoneNumber: string) => void;
  onSetWard: (ward: string) => void;
}

const DeliveryAddress = ({
  register,
  onSetName,
  onSetPhoneNumber,
  onSetWard,
  defaultDistrictValue,
  defaultUserName,
  defaultUserPhoneNumber,
  phoneNumberList,
  defaultWardValue,
  onSetDistrict,
  errors,
}: DeliveryAddressProps) => {
  const [province, setProvince] = useState("Hồ Chí Minh");
  const [districtId, setDistrictId] = useState<number | null>(null);
  const handleSetDistrictId = useCallback(
    (id: number) => setDistrictId(id),
    []
  );
  const errorsMap = useRef(
    new Map<keyof IAddressValidation, IErrorFieldType>()
  );
  const errorEntries = Object.entries(errors);
  useEffect(() => {
    if (errorEntries.length) {
      errorEntries.forEach(([key, value]) => {
        errorsMap.current = errorsMap.current.set(
          key as keyof IAddressValidation,
          value
        );
      });
    }
  }, [errorEntries]);
  return (
    <div id='delivery-address-box' className='flex flex-col gap-4'>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <UserNameAddress
          error={errors.name}
            onSetName={onSetName}
            defaultValue={defaultUserName}
          />
          {errors.name?.message && (
            <ErrorMsg
              className='text-xs md:text-base'
              msg={
                errors.name.message === "Required"
                  ? REQUIRED_NAME
                  : errors.name.message
              }
            />
          )}
        </div>
        <div className='flex-1'>
          <UserPhoneNumberAddress
          error={errors.phoneNumber}
            phoneNumberList={phoneNumberList}
            onSetPhoneNumber={onSetPhoneNumber}
            defaultValue={defaultUserPhoneNumber}
          />
          {errors.phoneNumber && (
            <ErrorMsg
              className='text-xs md:text-base'
              msg={
                errors.phoneNumber.message === "Required"
                  ? REQUIRED_PHONE_NUMBER
                  : errors.phoneNumber.message
              }
            />
          )}
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <div
          className={cn("flex-1", {
            "h-[70px]": errorsMap.current.get("district")?.message,
          })}
        >
          <Input
            data-cy='province-address-item'
            value={province}
            onChange={() => setProvince(SUPPORTED_PROVINCE)}
            className='outline-none outline-0 ring-0 focus-visible:ring-0 cursor-default disabled:cursor-default disabled:border-gray-500'
            onClick={() =>
              toast.info(
                "Hiện tại shop chỉ giao hàng tại thành phố Hồ Chí Minh"
              )
            }
          />
        </div>
        <div
          className={cn("flex-1", {
            "h-[70px]": errorsMap.current.get("district")?.message,
          })}
        >
          <DistrictAddress
          error={errors.district}
            defaultValue={defaultDistrictValue}
            currentSelectedDistrictId={districtId}
            onSetDistrict={onSetDistrict}
            onSetDistrictId={handleSetDistrictId}
          />
          {errors.district && (
            <ErrorMsg
              className='text-xs md:text-base'
              msg={
                errors.district.message === "Required"
                  ? REQUIRED_DISTRICT
                  : errors.district.message
              }
            />
          )}
        </div>
      </div>
      <div
        className={cn("flex-1", {
          "h-[70px]": errorsMap.current.get("ward")?.message,
        })}
      >
        <WardsAddress
        error={errors.ward}
          defaultValue={defaultWardValue}
          onSetWard={onSetWard}
          districtId={districtId}
        />
        {errors.ward?.message && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={
              errors.ward.message === "Required"
                ? REQUIRED_WARD
                : errors.ward.message
            }
          />
        )}
      </div>
      <div
        className={cn("flex-1", {
          "h-[70px]": errorsMap.current.get("street")?.message,
        })}
      >
        <Input
          {...register("street")}
          error={errors.street}
          data-cy='street-address-item'
          defaultValue=''
          placeholder='Số nhà tên đường'
          id='street-address'
        />
        {errors.street?.message && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={
              errors.street.message === "required"
                ? REQUIRED_STREET
                : errors.street.message
            }
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryAddress;
