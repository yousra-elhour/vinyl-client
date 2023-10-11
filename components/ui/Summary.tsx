"use client";

import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import Currency from "./Currency";
import { cn } from "@/lib/utils";
import useCart from "@/hooks/use-cart";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAllItems);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
      }
    );
    window.location = response.data.url;
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 flex flex-col items-stretch"
    >
      <h2
        id="summary-heading"
        className="text-lg font-medium text-gray-900 font-header"
      >
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>

          <Currency
            className={cn("lg:text-sm font-medium text-gray-900")}
            value={totalPrice}
          />
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Shipping estimate</span>
            <Link
              href="#"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
              title="Calculated on checkout"
            >
              <span className="sr-only">
                Learn more about how shipping is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </dt>
          <Currency
            className={cn("lg:text-sm font-medium text-gray-900")}
            value={0.0}
          />
        </div>
        {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex text-sm text-gray-600">
            <span>Tax estimate</span>
            <Link
              href="#"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how tax is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </dt>
          <Currency
            className={cn("lg:text-sm font-medium text-gray-900")}
            value={8.32}
          />
        </div> */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <Currency
            className={cn(
              " font-bold text-gray-900 lg:text-md md:text-sm sm:text-sm text-sm"
            )}
            value={totalPrice}
          />
        </div>
      </dl>

      <Button
        title="Checkout"
        onClick={onCheckout}
        disabled={items.length === 0}
        color="gray"
        className=" py-3 mt-6  shadow-none px-2 leading-8 tracking-tighter text-xl text-white font-header text-center bg-black rounded-sm "
      >
        Checkout
      </Button>
    </section>
  );
};

export default Summary;
