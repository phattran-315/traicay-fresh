import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-gray-900 font-semibold hover:bg-primary/90 disabled:bg-primary/80",
        destructive:
          "bg-background border border-destructive text-destructive hover:bg-destructive/90 hover:text-white",
        outline:
          "border border-primary/80 bg-background hover:bg-primary text-primary hover:text-accent-foreground disabled:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 disabled:bg-primary/80",
        "secondary-outline":
          " border border-secondary text-secondary/80 hover:text-white hover:bg-secondary/80 disabled:bg-primary/80",
          "destructive-contained":
          "bg-destructive text-white font-semibold hover:bg-destructive/70 disabled:bg-destructive/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        'text-destructive':'text-destructive bg-transparent hover:bg-transparent',
        'text-primary':'text-primary bg-transparent'
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
