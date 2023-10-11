"use client";

import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { Product } from "@/types";
import Link from "next/link";
import Currency from "./Currency";
import useCart from "@/hooks/use-cart";

interface CartProps {
  data: Product;
}

export default function Cart({ data }: CartProps) {
  const cart = useCart();
  const onRemove = () => {
    cart.removeItem(data.id);
  };
  return (
    <li key={data.id} className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          src={data.imageUrl}
          alt={data.album}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0 h-[100%]">
          <div className="flex flex-col justify-between py-2">
            <div className="">
              <h3 className="lg:text-lg md:text-lg sm:text-md text-md">
                <Link
                  href={`/product/${data.id}`}
                  className="font-medium text-gray-200 hover:text-gray-100 "
                >
                  {data.album}
                </Link>
              </h3>
              <div className="mt-1 lg:text-md md:text-md sm:text-sm text-sm">
                <p className="text-gray-500">{data.artist}</p>
              </div>
            </div>

            <Currency value={data.price} className="mt-1" />
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            {/* <label htmlFor={`quantity-}`} className="sr-only">
              Quantity, {data.album}
            </label>
            <select
              id={`quantity-`}
              name={`quantity-`}
              className="max-w-full bg-background rounded-sm border border-gray-400 py-2 px-2 text-left text-base font-medium leading-5 text-gray-400  focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
            </select> */}

            <div className="absolute right-0 top-0">
              <button
                type="button"
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                onClick={onRemove}
              >
                <span className="sr-only">Remove</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* <p className="mt-4 flex space-x-2 text-sm text-gray-400">
                      {data.inStock ? (
                        <CheckIcon
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {data.inStock
                          ? "In stock"
                          : `Ships in ${data.leadTime}`}
                      </span>
                    </p> */}
      </div>
    </li>
  );
}
