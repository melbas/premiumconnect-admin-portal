
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean;
  ripple?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className, 
  loading = false,
  ripple = true,
  disabled,
  ...props 
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => {
    if (ripple) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (ripple) setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "focus:ring-2 focus:ring-offset-2 focus:ring-primary/30",
        isPressed && "scale-95",
        className
      )}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...props}
    >
      <span className={cn(
        "flex items-center gap-2 transition-opacity",
        loading && "opacity-0"
      )}>
        {children}
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      {ripple && isPressed && (
        <div className="absolute inset-0 bg-white/20 animate-ping rounded-md" />
      )}
    </Button>
  );
};
