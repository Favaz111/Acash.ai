import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'gradient-primary text-white hover:shadow-lg',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline:
          'border-2 border-gray-200 bg-white text-gray-700 hover:border-primary-trust hover:text-primary-trust',
        ghost: 'hover:bg-gray-100 text-gray-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        success: 'gradient-success text-white hover:shadow-lg',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    // Note: asChild is extracted but not used (for future Slot implementation)
    // For now, we just prevent it from being passed to the DOM element
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
