"use client";

interface ButtonProps {
  title: string;
  className?: string;
}

const Button = ({ title, className }: ButtonProps) => {
  return (
    <div
      className={`block py-3 px-2 leading-8 tracking-tighter text-xl text-black font-header text-center bg-white focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 hover:bg-black hover:text-white transition-all rounded-sm ${className}`}
    >
      {title}
    </div>
  );
};

export default Button;
