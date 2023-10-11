"use client";

import { MouseEventHandler, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface AddToCartProps {
  data: Product;
}

export default function AddToCart({ data }: AddToCartProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  return (
    <div className="flex gap-2 mb-10 mt-16 ">
      <Button
        onClick={onAddToCart}
        style={{ padding: "1rem 0" }}
        className="w-[100%] leading-8 tracking-tighter text-xl text-black font-header text-center bg-white focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 hover:bg-black hover:text-white transition-all rounded-sm"
      >
        Add to bag
      </Button>

      {/* <div className="w-[%] flex items-center justify-between border border-gray-50 outline-none focus:ring-2 focus:ring-white-50 focus:ring-opacity-50 rounded-sm">
        <input
          title="quantity"
          className="w-1/3 text-center text-xl bg-transparent font-header opacity-80 "
          type="text"
          readOnly
          value={quantity}
          onChange={(event) =>
            handleQuantityChange(parseInt(event.target.value, 10))
          }
          min="1"
        />
        <div className="flex flex-col opacity-80 ">
          <Button
            title="up"
            style={{ width: "100%", backgroundColor: "transparent" }}
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-1/2  font-header "
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
          <Button
            title="down"
            style={{ width: "100%", backgroundColor: "transparent" }}
            onClick={() => handleQuantityChange(quantity - 1)}
            className=" w-1/2   font-header "
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </div> */}
    </div>
  );
}
