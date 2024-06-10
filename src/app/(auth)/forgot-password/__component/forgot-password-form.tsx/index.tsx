"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GENERAL_ERROR_MESSAGE } from "@/constants/app-message.constant";
import { cn } from "@/lib/utils";
import { forgotPassword as forgotPasswordApi } from "@/services/auth.service";
import { trpc } from "@/trpc/trpc-client";
import { AuthCredentialSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ErrorMsg from "@/components/atoms/error-msg";
import { useEffect, useState } from "react";
import { handleTrpcErrors } from "@/utils/error.util";
import useDisableClicking from "@/hooks/use-disable-clicking";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";

const TIMER_SEND_REQUEST_AGAIN = 90;
const EmailValidationSchema = AuthCredentialSchema.pick({ email: true });

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { handleSetMutatingState } = useDisableClicking();
  const [isRequestSendAgain, setIsRequestSendAgain] = useState(false);
  const [timerSendRequestAgain, setTimerSendRequestAgain] = useState(
    TIMER_SEND_REQUEST_AGAIN
  );
  const {
    register,
    formState: { errors },
    getValues,
    setFocus,
    handleSubmit,
  } = useForm<{ email: string }>({
    resolver: zodResolver(EmailValidationSchema),
  });

  const {
    mutateAsync: checkEmailExists,
    isPending: isCheckingEmailExists,
    isSuccess: isCheckingEmailExistsSuccess,
  } = trpc.auth.checkIfEmailExist.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
  });
  // const {
  //   mutate: forgotPassword,
  //   isPending,
  //   isSuccess,
  // } = useMutation({
  //   mutationFn: forgotPasswordApi,
  //   onError: (error) => {
  //     toast.error(GENERAL_ERROR_MESSAGE);
  //   },
  //   onSuccess: (data) => {
  //     if (data.ok)
  //       return toast.success(`Link đổi mật khẩu đã được gửi qua email`);

  //     toast.error(GENERAL_ERROR_MESSAGE);
  //   },
  // });
  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
  } = trpc.auth.forgotPassword.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => handleTrpcSuccess(router, data.message),
  });
  const handleSendForgetPasswordRequest = handleSubmit(async ({ email }) => {
    await checkEmailExists({ email }).catch((err) => handleTrpcErrors(err));
    forgotPassword({ email });
  });
  const handleSendRequestAgain = async () => {
    if (isRequestSendAgain) return;
    setIsRequestSendAgain(true);
    const email = getValues("email");
    await checkEmailExists({ email });
    forgotPassword({ email });
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      isRequestSendAgain &&
      timerSendRequestAgain === TIMER_SEND_REQUEST_AGAIN
    ) {
      timer = setInterval(
        () => setTimerSendRequestAgain((prev) => prev - 1),
        1000
      );
    }
    if (timerSendRequestAgain === 0) {
      setIsRequestSendAgain(false);
      setTimerSendRequestAgain(TIMER_SEND_REQUEST_AGAIN);
      return () => clearInterval(timer);
    }
  }, [isRequestSendAgain, timerSendRequestAgain]);
  //
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);
  const isMutating = isPending || isCheckingEmailExists || isRequestSendAgain;
  useEffect(() => {
    if (isPending) {
      handleSetMutatingState(true);
    }
    if (!isPending) {
      handleSetMutatingState(false);
    }
  }, [isPending, handleSetMutatingState]);
  return (
    <>
      <form
        className='mt-8 grid gap-y-4'
        onSubmit={handleSendForgetPasswordRequest}
      >
        <div>
          <Label htmlFor='email' className='block mb-2'>
            Email
          </Label>
          <Input
            data-cy='input-email-forgot-password'
            error={errors.email}
            {...register("email")}
            placeholder='email@gmail.com'
            id='email'
          />
          {errors.email && <ErrorMsg msg={errors.email.message} />}
        </div>

        <Button disabled={isMutating} variant='secondary'>
          {!isSuccess
            ? "Nhận mã khôi phục"
            : "Link thay đổi mật khẩu đã được gửi đến email của bạn"}
        </Button>
        {isSuccess && (
          <>
            <div className='text-center text-sm md:text-base'>
              Không nhận được mã?{" "}
              <button
                onClick={handleSendRequestAgain}
                disabled={false}
                type='button'
                className={cn("text-primary", {
                  "text-primary/70": isRequestSendAgain,
                })}
              >
                Thử lại{" "}
                {isRequestSendAgain
                  ? `sau ${timerSendRequestAgain} giây`
                  : null}
              </button>{" "}
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default ForgotPasswordForm;
