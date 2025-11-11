
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  let baseStyles = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  if (variant === 'primary') {
    baseStyles += ' bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500';
  } else if (variant === 'secondary') {
    baseStyles += ' bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-500';
  } else if (variant === 'danger') {
    baseStyles += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
  }

  return (
    <button className={`${baseStyles} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;