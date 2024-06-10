"use client";
import {
  AddressValidationSchema,
  IAddressValidation,
  PhoneValidationSchema,
} from "@/validations/user-infor.valiator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

const useAddress = (defaultValue?: IAddressValidation) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    trigger,
    formState: { errors },
  } = useForm<IAddressValidation>({
    resolver: zodResolver(AddressValidationSchema),
    defaultValues: defaultValue,
  });
  const setDistrictValue = useCallback(
    (district: string) => {
      setValue("district", district);
    },
    [setValue]
  );
  const setWardValue = useCallback(
    (ward: string) => setValue("ward", ward),
    [setValue]
  );
  const setNameValue = useCallback(
    (name: string) => setValue("name", name),
    [setValue]
  );
  const setPhoneNumberValue = useCallback(
    (phoneNumber: string) => setValue("phoneNumber", phoneNumber),
    [setValue]
  );
  const nameValue = watch("name");
  const phoneNumberValue = (watch("phoneNumber"));
  const districtValue = watch("district");
  const wardValue = watch("ward");
  const streetValue = watch("street");
  useEffect(() => {
    // reset if the value is set
    if (Object.keys(errors).length) {
      if (nameValue) {
        clearErrors('name')
        // setError("name", { message: "" });
      }
      if (PhoneValidationSchema.safeParse({phoneNumber:phoneNumberValue}).success) {
        clearErrors('phoneNumber')

        // setError("phoneNumber", { message: "" });
      }
      if (districtValue) {
        clearErrors('district')
        // setError("district", { message: "" });
      }
      if (wardValue) {
        clearErrors('ward')
        // setError("ward", { message: "" });
      }
      if (
        AddressValidationSchema.pick({ street: true }).safeParse(streetValue)
          .success
      ) {
        clearErrors('street')
        // setError("street", { message: "" });
      }
    }
  }, [districtValue, streetValue, wardValue, clearErrors, errors,nameValue,phoneNumberValue]);
  return { setWardValue, setDistrictValue, register, handleSubmit, errors ,setNameValue,setPhoneNumberValue,trigger,watch};
};

export default useAddress;
