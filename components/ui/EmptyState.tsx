"use client";

import { useRouter } from "next/navigation";

import { Button } from "@material-tailwind/react";
import Heading from "@/components/ui/heading";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Something went wrong",
  subtitle = "Try again.",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div
      className="
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
      "
    >
      <Heading title={title} description={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            className="w-[100%] leading-8 tracking-tighter text-xl text-black font-header text-center bg-white focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 hover:bg-black hover:text-white transition-all rounded-sm"
            onClick={() => router.push("/")}
          >
            Go back
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
