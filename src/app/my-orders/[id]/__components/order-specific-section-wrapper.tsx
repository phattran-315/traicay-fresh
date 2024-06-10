import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";
interface OrderSpecificSectionWrapper extends PropsWithChildren {
  className?:string
}

const OrderSpecificSectionWrapper = ({
  className,
  children,
}: OrderSpecificSectionWrapper) => {
  return <div>
    <div className={cn(`${className} h-full flex gap-1.5 sm:gap-3 bg-gray-50 shadow-sm py-4 px-2`)}>{children}</div>
  </div>
};

export default OrderSpecificSectionWrapper;
