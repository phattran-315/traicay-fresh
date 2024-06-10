"use client";
import { useEffect } from "react";

import ErrorMsg from "@/components/atoms/error-msg";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import {
  AuthCredentialSchema,
  IAuthCredential,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useDisableClicking from "@/hooks/use-disable-clicking";

const LoginByEmail = () => {
  const { handleSetMutatingState } = useDisableClicking();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartItems = useCart((store) => store.items);
  const origin = searchParams.get("origin") || "";
  const {
    register,
    formState: { errors },
    setFocus,
    handleSubmit,
  } = useForm<IAuthCredential>({
    resolver: zodResolver(AuthCredentialSchema),
  });
  const { mutate: setUserCart } = trpc.user.setUserCart.useMutation();
  const { mutate, isPending } = trpc.auth.login.useMutation({
    onError(error) {
      handleTrpcErrors(error);
    },
    onSuccess(data) {
      toast.success(data?.message);
      // after login successfully updated the cart of user
      if (cartItems.length) {
        const cartItemUser = cartItems.map((item) => ({
          product: item.id,
          ...item,
          quantity: item.quantity,
        }));
        setUserCart(cartItemUser);
      }
      router.refresh();
      setTimeout(() => {
        if (origin) {
          const search = window.location.search;
          let userParams: string=''
          if (search && search.includes("&")) {
            // Find the index of the first '&' after '?origin='
            const originEndIndex = search.indexOf("&");

            if (originEndIndex !== -1) {
              // Extract the substring starting from the character after the first '&' to the end
              const result = search.substring(originEndIndex + 1);
              userParams = result;
            }
          }

          return router.push(`/${origin}?${userParams}`);
        }
        router.push("/");
      }, 500);
    },
  });
  const login = handleSubmit(({ email, password }) => {
    mutate({ email, password });
  });
  // first focus to the name field
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);
  useEffect(() => {
    if (isPending) {
      handleSetMutatingState(true);
    }
    if (!isPending) {
      handleSetMutatingState(false);
    }
  }, [isPending, handleSetMutatingState]);
  return (
    <form onSubmit={login} className='mt-8 grid gap-y-4'>
      <div>
        <Label htmlFor='email' className='block mb-2'>
          Email
        </Label>
        <Input
          data-cy='input-email-login'
          {...register("email")}
          error={errors.email}
          placeholder='email@gmail.com'
          id='email'
        />
        {errors.email && <ErrorMsg field='email' msg={errors.email.message} />}
      </div>
      <div>
        <Label htmlFor='password' className='block mb-2'>
          Mật khẩu
        </Label>
        <InputPassword
          data-cy='input-password-login'
          {...register("password")}
          error={errors.password}
          placeholder='Nhập mật khẩu'
          id='password'
        />

        {errors.password && (
          <ErrorMsg field='password' msg={errors.password.message} />
        )}
      </div>
      <Link
        data-cy='forgot-password-link'
        href={{
          pathname: APP_URL.forgotPassword,
          query: {
            origin: "login",
          },
        }}
        className={buttonVariants({ variant: "link" })}
      >
        Quên mật khẩu?
      </Link>
      <Button data-cy='btn-submit-login'>
        {isPending ? "Đang đăng nhập" : "Đăng nhập"}
      </Button>

      <Link
        href={APP_URL.signUp}
        className={buttonVariants({ variant: "link" })}
      >
        Chưa có tài khoản. Đăng kí ngay &rarr;
      </Link>
    </form>
  );
};

export default LoginByEmail;
