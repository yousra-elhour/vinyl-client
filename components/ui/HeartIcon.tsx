import React from "react";
import { HeartIcon } from "lucide-react";
import useShortlist from "@/hooks/use-shortlist";
import { Product } from "@/types";

interface ToggleHeartIconProps {
  product: Product; // Pass the product as a prop
}

const ToggleHeartIcon: React.FC<ToggleHeartIconProps> = ({ product }) => {
  const { items, addItem, removeItem } = useShortlist();

  const isLiked = items.some((item) => item.id === product.id);

  const toggleHeart = () => {
    if (isLiked) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <button onClick={toggleHeart} className="z-50">
      {isLiked ? <HeartIcon fill="white" /> : <HeartIcon />}
    </button>
  );
};

export default ToggleHeartIcon;
