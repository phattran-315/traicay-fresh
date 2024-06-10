"use client";
import { useState } from "react";

import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";

import LoginByPhoneNumberForm from "./login-by-phone-number-form";
import VerifyOtp from "./verify-otp";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginByPhoneNumberProps {
  routeToPushAfterVerifying: keyof typeof APP_URL;
  title: string;
}
export function LoginByPhoneNumber({
  title,
  routeToPushAfterVerifying,
}: LoginByPhoneNumberProps) {
  const router = useRouter();
  const [isShowOtp, setIsShowOtp] = useState(false);
  const searchParams = useSearchParams();
  const origin = searchParams.get(APP_PARAMS.origin);
  const checkoutFlow = searchParams.get(APP_PARAMS.checkoutFlow) || "";
  const productId = searchParams.get(APP_PARAMS.productId) || "";
  const handleToggleShowOtp = () => {
    setIsShowOtp((prev) => !prev);
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <>
      {!isShowOtp && (
        <LoginByPhoneNumberForm
          title={title}
          onSetPhoneNumber={(phoneNumber) => setPhoneNumber(phoneNumber)}
          onSetIsShowOtp={(state) => {
            setIsShowOtp(state);
            router.push(
              !origin
                ? `?${APP_PARAMS.isOpenOtp}=${state}`
                : `?${APP_PARAMS.origin}=${origin}&${APP_PARAMS.checkoutFlow}=${checkoutFlow}&${APP_PARAMS.productId}=${productId}&${APP_PARAMS.isOpenOtp}=${state}`
            );
            // set the router is showotp on the browser
          }}
        />
      )}
      {isShowOtp && (
        <VerifyOtp
          routeToPushAfterVerifying={routeToPushAfterVerifying}
          onToggleShowOtp={handleToggleShowOtp}
          phoneNumber={phoneNumber}
        />
      )}
    </>
  );
}

export default LoginByPhoneNumber;
