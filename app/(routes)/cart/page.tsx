"use client";
import Cart from "@/components/ui/Cart";
import Summary from "@/components/ui/Summary";
import useCart from "@/hooks/use-cart";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();
  const [parent] = useAutoAnimate();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-screen 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6">
      <div className="pl-2 pb-24 pt-16 ">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-2xl font-header mb-2">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            {cart.items.length === 0 && (
              <p className="text-white">No Items added to cart</p>
            )}
            <ul
              role="list"
              className="divide-y divide-gray-800 border-b border-t border-gray-800"
              ref={parent}
            >
              {cart.items.map((item) => (
                <Cart data={item} />
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <Summary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
