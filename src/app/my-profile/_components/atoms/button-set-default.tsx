import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";
interface ButtonSetDefaultProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  className?: string;
  disabled: boolean;
}
const ButtonSetDefault = ({
  onClick,
  className,
  disabled,
}: ButtonSetDefaultProps) => {
  return (
    <button
    data-cy='set-default-my-profile-item-btn'
      onClick={onClick}
      disabled={disabled}
      className={cn("text-sm text-primary", className)}
    >
      Đặt làm địa chỉ mặc định
    </button>
  );
};

export default ButtonSetDefault;
