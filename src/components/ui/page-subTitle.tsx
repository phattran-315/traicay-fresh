import { cn } from "@/lib/utils";
import React, { HTMLAttributes, PropsWithChildren } from "react";

interface PageSubTitleProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}
const PageSubTitle = ({ children, className, ...rest }: PageSubTitleProps) => {
  return (
    <h4 {...rest} className={cn("text-lg font-bold mt-6 mb-4 md:text-xl", className)}>
      {children}
    </h4>
  );
};

export default PageSubTitle;
