import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  href, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-manrope font-semibold rounded-full transition-all duration-300 ease-in-out px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base";
  
  const variants = {
    primary: "bg-saffron text-midnight hover:bg-opacity-90 hover:-translate-y-0.5 shadow-md hover:shadow-lg",
    secondary: "bg-transparent text-warm-white border border-warm-white/85 hover:bg-warm-white hover:text-midnight",
  };

  const appliedClass = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={appliedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button className={appliedClass} {...props}>
      {children}
    </button>
  );
};
