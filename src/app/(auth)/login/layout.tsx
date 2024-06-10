import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Đăng nhập |",
};
const LoginLayout = ({ children }: { children: ReactNode }) => {
  return <section>{children}</section>;
};

export default LoginLayout;
