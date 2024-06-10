"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { InputProps as VanillaInputProps } from "./input";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,VanillaInputProps {}

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({error, className, type, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleToggleState = () => setIsOpen((prev) => !prev);
    return (
      <div className='relative'>
        <input
          type={!isOpen?'password':'text'}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            {
              "invalid-input invalid-input:focus-visible": error,
            },           
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          tabIndex={-1}
          onClick={handleToggleState}
          type='button'
          className='absolute top-1/2 -translate-y-1/2 right-6'
        >
          {!isOpen ? (
            <IoEyeOffOutline className='w-4 h-4' />
          ) : (
            <IoEyeOutline className='w-4 h-4' />
          )}
        </button>
      </div>
    );
  }
);
InputPassword.displayName = "Input";

export { InputPassword };
