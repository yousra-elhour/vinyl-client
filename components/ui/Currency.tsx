"use client";
import { formatter } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CurrencyProps {
  value?: string | number;
  className?: string;
}

const Currency = ({ value, className }: CurrencyProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  const combinedClassName = cn(
    "lg:text-lg md:text-sm sm:text-xs text-md tracking-widest  font-medium text-gray-100",
    className // Pass the provided className here
  );
  return <p className={combinedClassName}>{formatter.format(Number(value))}</p>;
};

export default Currency;
