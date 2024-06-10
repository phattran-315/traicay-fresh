import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { APP_URL } from "@/constants/navigation.constant";
import { Metadata } from "next";
import { Radio_Canada } from "next/font/google";
import React, { ReactNode } from "react";

const poiretOne = Radio_Canada({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Liên hệ",
};
const ContactLayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    <section className={poiretOne.className}>
      <BreadCrumbLinks links={[{ label: "Liên hệ", href: APP_URL.contact }]} />
      {children}
    </section>
  );
};

export default ContactLayoutPage;
