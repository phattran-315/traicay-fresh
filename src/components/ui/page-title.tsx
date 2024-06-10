import { cn } from "@/lib/utils";
import React, { HTMLAttributes, PropsWithChildren } from "react";

interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement>,PropsWithChildren  {
  
  className?: string;
}

const PageTitle = ({ children, className, ...rest }: PageTitleProps) => {
  return (
    <h2
      {...rest}
      className={cn("text-2xl font-bold mt-4 mb-6 text-gray-800", className)}
    >
      {children}
    </h2>
  );
};

export default PageTitle;
