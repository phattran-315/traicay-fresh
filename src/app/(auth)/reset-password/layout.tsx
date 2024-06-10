import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Đổi lại mật khẩu ",
};
const VerifyEmailLayout = ({ children }: { children: ReactNode }) => {
  return <section>{children}</section>;
};

export default VerifyEmailLayout;
