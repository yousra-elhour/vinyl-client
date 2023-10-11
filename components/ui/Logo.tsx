"use client";

interface FooterProps {
  className?: string;
}

export default function Logo(props: FooterProps) {
  return (
    <>
      <div className={`h3 cursor-pointer font-header ${props.className}`}>
        VINYL
      </div>
    </>
  );
}
