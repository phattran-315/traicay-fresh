"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ErrorMsg from "@/components/atoms/error-msg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { validateNumericInput } from "@/utils/util.utls";
import {
  IPhoneNumberValidation,
  PhoneValidationSchema,
} from "@/validations/user-infor.valiator";
import { handleTrpcSuccess } from "@/utils/success.util";
import useDisableClicking from "@/hooks/use-disable-clicking";

interface LoginByPhoneNumberProps {
  onSetIsShowOtp: (state: boolean) => void;
  onSetPhoneNumber: (phoneNumber: string) => void;
  title: string;
}
const LoginByPhoneNumber = ({
  onSetPhoneNumber,
  onSetIsShowOtp,
  title,
}: LoginByPhoneNumberProps) => {
  const {handleSetMutatingState}=useDisableClicking()
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const { isPending: isSendingOtp, mutate: loginByPhoneNumber } =
    trpc.customerPhoneNumber.requestOtp.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
        onSetIsShowOtp(true);
      },
    });
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<IPhoneNumberValidation>({});
  const handleSendPhoneVerification = handleSubmit(({ phoneNumber }) => {
    loginByPhoneNumber({ phoneNumber: phoneNumber });
  });
  const validateIsNumberEntered = (e: ChangeEvent<HTMLInputElement>) => {
    if (validateNumericInput(e.target.value)) {
      const phoneNumber = e.target.value;
      setPhoneNumber(phoneNumber);
      onSetPhoneNumber(phoneNumber);
    }
    return;
  };
  useEffect(() => {
    setFocus("phoneNumber");
  }, [setFocus]);
  const isMutating=isSendingOtp
  
  useEffect(()=>{
    if(isMutating){
      handleSetMutatingState(true)
    }
    if(!isMutating){
      handleSetMutatingState(false)
  
    }
  },[isMutating,handleSetMutatingState])
  return (
    <form
      data-cy='login-by-phone-number-form'
      onSubmit={handleSendPhoneVerification}
      className='flex flex-col '
    >
      <p className='text-lg font-bold text-center mb-4 md:mb-6'>{title}</p>
      <Input
        type='tel'
        value={phoneNumber}
        error={errors.phoneNumber}
        pattern='^[0-9]*$'
        {...register("phoneNumber", {
          required: "Vui lòng nhập số điện thoại",
          onChange: (e) => {
            validateIsNumberEntered(e);
          },
          validate: (val) => {
            const replace0To84 = val.replace("0", "84");

            return (
              PhoneValidationSchema.safeParse({
                phoneNumber: replace0To84,
              }).success || "Vui lòng nhập đúng định dạng số điện thoại"
            );
          },
        })}
        placeholder='Nhập số điện thoại'
      />

      {errors.phoneNumber && <ErrorMsg msg={errors.phoneNumber.message} />}
      <Button
        data-cy='login-by-phone-number-submit-btn'
        disabled={isSendingOtp}
        className={cn("self-center mt-4 block md:mt-6 w-1/2", {
          "w-3/4": isSendingOtp,
        })}
      >
        {isSendingOtp ? "Đang gửi OTP " : <>Xác nhận</>}
      </Button>
    </form>
  );
};

export default LoginByPhoneNumber;
