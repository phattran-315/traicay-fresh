import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";
import { IoCreateOutline } from "react-icons/io5";

interface ButtonAdjustProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  className?: string;
  disabled: boolean;
  sizeIcon?: number;
}
const ButtonAdjust = ({
  onClick,
  className,
  disabled,
  sizeIcon,
  ...rest
}: ButtonAdjustProps) => {
  return (
    <button
    data-cy='adjust-my-profile-item-btn'
      {...rest}
      disabled={disabled}
      className={cn("text-primary", className)}
      onClick={onClick}
    >
      <span className='flex items-center gap-2'>
        <IoCreateOutline /> <span className='text-primary'>Sửa</span>{" "}
      </span>
    </button>
  );
};

export default ButtonAdjust;
