"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Currency from "./Currency";
import useCart from "@/hooks/use-cart";
import Image from "next/image";

interface SideCartProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideCart({ open, setOpen }: SideCartProps) {
  const cart = useCart();
  const items = useCart((state) => state.items);
  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative"
        style={{ zIndex: "9000" }}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg text-gray-900 font-header">
                          Shopping cart
                          {/* <div className="text-sm font-body text-gray-500">
                            Order #{order}
                          </div> */}
                        </Dialog.Title>

                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.items.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <Image
                                    width={300}
                                    height={300}
                                    loading="lazy"
                                    sizes="100vw"
                                    placeholder="empty"
                                    src={item.imageUrl}
                                    alt={item.album}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link href={item.id}>
                                          {item.artist}
                                        </Link>
                                      </h3>
                                      <Currency
                                        value={item.price}
                                        className=" text-black"
                                      />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.album}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    {/* <select
                                      title="quanitity"
                                      id={`quantity-${itemIdx}`}
                                      name={`quantity-${itemIdx}`}
                                      value={0}
                                      className="max-w-full  rounded-sm border border-gray-800 py-2 px-2 text-left text-base font-medium leading-5 text-gray-400  focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
                                      onChange={(e) => {
                                        // Handle the onChange event if needed
                                      }}
                                    >
                                      {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                        (quantity) => (
                                          <option
                                            key={quantity}
                                            value={quantity}
                                            selected={
                                              product.quantity === quantity
                                            }
                                          >
                                            {quantity}
                                          </option>
                                        )
                                      )}
                                    </select> */}

                                    <div>{""}</div>

                                    <div className="flex">
                                      <button
                                        onClick={() => {
                                          cart.removeItem(item.id);
                                        }}
                                        type="button"
                                        className="font-bold text-gray-900 hover:text-gray-600"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                        <p>Subtotal</p>

                        <Currency
                          className="text-base text-gray-900 lg:text-md sm:text-md text-md"
                          value={totalPrice}
                        />
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <Link
                          href={"/cart"}
                          onClick={() => setOpen(false)}
                          className="block py-3 px-2 leading-8 tracking-tighter text-xl text-white font-header text-center bg-black focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 hover:bg-white hover:text-black transition-all rounded-sm"
                        >
                          Checkout
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button
                            type="button"
                            className=" ml-2 font-bold text-gray-900 hover:text-gray-700"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
