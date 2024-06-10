import { APP_PARAMS } from "@/constants/navigation.constant";
import { trpc } from "@/trpc/trpc-client";

import { handleTrpcErrors } from "@/utils/error.util";
import {
  ISignUpCredential,
  SignUpCredentialSchema,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useCheckPasswordAndPasswordConfirm from "../hooks/useCheckPasswordAndPasswordConfirm";
import useDisableClicking from "@/hooks/use-disable-clicking";

const useSignUp = () => {
  const {
    comparePasswordAndPasswordConfirm,
    isPasswordAndPasswordConfirmSame,
  } = useCheckPasswordAndPasswordConfirm();
  const router = useRouter();
  const {
    register,
    formState: { errors, isValid },
    setFocus,
    handleSubmit,
    getValues,
    watch,
  } = useForm<ISignUpCredential>({
    resolver: zodResolver(SignUpCredentialSchema),
  });
  const { handleSetMutatingState } = useDisableClicking();
  const { mutate, isPending } = trpc.auth.signUp.useMutation({
    onError(error) {
      handleTrpcErrors(error);
    },
    onSuccess: async ({ emailSentTo }) => {
      
      toast.success("Link xác nhận đã được gửi đến email" + " " + emailSentTo);
      setTimeout(() => {
        router.push(`/verify-email?${APP_PARAMS.toEmail}${emailSentTo}`);
      }, 1500);
    },
  });

  const signUp = handleSubmit(({ email, name, password, passwordConfirm }) => {
    mutate({ email, name, password, passwordConfirm });
  });
  // first focus to the name field
  useEffect(() => {
    setFocus("name");
  }, [setFocus]);
  useEffect(() => {
    if (isPending) {
      handleSetMutatingState(true);
    }
    if (!isPending) {
      handleSetMutatingState(false);
    }
  }, [isPending, handleSetMutatingState]);
  return {
    watch,
    comparePasswordAndPasswordConfirm,
    isValid,
    signUp,
    register,
    isPending,
    isPasswordAndPasswordConfirmSame,
    errors,
    getValues,
  };
};

export default useSignUp;
