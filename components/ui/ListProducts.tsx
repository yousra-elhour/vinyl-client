"use client";

import { useState, useEffect, useRef } from "react";
import ToggleHeartIcon from "./HeartIcon";
import Link from "next/link";
import SideCart from "./SideCart";
import { Genre, Product } from "@/types";
import Image from "next/image";
import NoResults from "./NoResults";
import Currency from "./Currency";
import useCart from "@/hooks/use-cart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SkeletonList from "./SkeletonList";
import { motion } from "framer-motion";
import { Button } from "@material-tailwind/react";

interface ListProductsProps {
  title?: string;
  shortlistTitle?: string;
  className?: string;
  products: Product[];
  genre?: Genre;
  hasSlider?: boolean;
  currentProduct?: Product;
}

export default function ListProducts({
  title,
  products,
  className,
  genre,
  shortlistTitle,
  hasSlider,
  currentProduct,
}: ListProductsProps) {
  const cart = useCart();
  const [openSideCart, setOpenSideCart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef(null);
  const [showMoreCount, setShowMoreCount] = useState(9);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setVisibleProducts(products.slice(0, showMoreCount));
  }, [products, showMoreCount]);

  const toggleShowMore = () => {
    setShowMoreCount(showMoreCount + 9);
  };

  if (!isMounted) {
    return <SkeletonList />;
  }

  const filteredProducts = currentProduct
    ? products.filter((p) => p.id !== currentProduct.id)
    : products;

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 800 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (hasSlider) {
    return (
      <div ref={scrollRef}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "easeOut", duration: 1 }}
          className={` ${className}`}
        >
          {title ? (
            <h2 className="lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold tracking-tight font-header lg:pt-20 md:pt-16 sm:pt-8 pt-8 text-white text-center">
              {title}
            </h2>
          ) : null}
          <Carousel
            responsive={responsive}
            itemClass="px-8"
            containerClass={` max-w-screen pb-16 lg:max-w-screen lg:mt-16 md:mt-16 sm:mt-10 mt-10 grid grid-cols-1 lg:gap-x-20 md:gap-x-10 sm:gap-x-6 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-25 ${className}`}
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <Image
                  width={300}
                  height={300}
                  loading="lazy"
                  sizes="100vw"
                  placeholder="empty"
                  src={product.imageUrl}
                  alt={product.album}
                  className="aspect-square overflow-hidden w-auto group-hover:opacity-75"
                />

                <div className="mt-6 flex justify-between">
                  <div>
                    <h3 className="lg:text-lg md:text-md sm:text-md text-lg font-bold text-gray-100">
                      <Link href={`/product/${product.id}`}>
                        <span
                          aria-hidden="true"
                          className="absolute inset-10"
                        />
                        {product.album}
                      </Link>
                    </h3>
                    <p className="lg:text-md md:text-sm sm:text-sm text-md text-gray-100">
                      {product.artist}
                    </p>
                    <Currency value={product.price} className="mt-3" />
                  </div>

                  <div className="flex flex-col items-end">
                    <ToggleHeartIcon product={product} />

                    <div className="lg:mt-9 md:mt-8 sm:mt-7 mt-10">
                      <button
                        onClick={() => {
                          setOpenSideCart(true);
                          cart.addItem(product);
                        }}
                        className="tracking-widest border-b-2 lg:text-md md:text-sm sm:text-xs text-md"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>

          <SideCart open={openSideCart} setOpen={setOpenSideCart} />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={scrollRef}>
      <div
        className={` max-w-screen 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6  pb-16 lg:max-w-screen ${className}`}
      >
        {genre ? (
          <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold tracking-tight font-header lg:pt-20 md:pt-16 sm:pt-8 pt-8 text-white ">
            {genre?.name}
          </h1>
        ) : null}

        {shortlistTitle ? (
          <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold tracking-tight font-header lg:pt-20 md:pt-16 sm:pt-8 pt-8 text-white ">
            {shortlistTitle}
          </h1>
        ) : null}

        {title ? (
          <h2 className="lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold tracking-tight font-header lg:pt-20 md:pt-16 sm:pt-8 pt-8 text-white text-center">
            {title}
          </h2>
        ) : null}

        {filteredProducts.length === 0 && !shortlistTitle ? (
          <NoResults />
        ) : null}
        {filteredProducts.length === 0 && shortlistTitle ? (
          <p className="mt-4">No Items added to shortlist</p>
        ) : null}

        <div
          className={`lg:mt-16 md:mt-16 sm:mt-10 mt-10 grid grid-cols-1 lg:gap-x-20 md:gap-x-10 sm:gap-x-6 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-25 ${className}`}
        >
          {visibleProducts.map((product) => (
            <div key={product.id} className="group relative">
              <Image
                width={300}
                height={300}
                sizes="100vw"
                src={product.imageUrl}
                alt={product.album}
                className="aspect-square overflow-hidden w-auto group-hover:opacity-75"
              />

              <div className="mt-6 flex justify-between">
                <div>
                  <h3 className="lg:text-lg md:text-md sm:text-md text-lg font-bold text-gray-100">
                    <Link href={`/product/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-10" />
                      {product.album}
                    </Link>
                  </h3>
                  <p className="lg:text-md md:text-sm sm:text-sm text-md text-gray-100">
                    {product.artist}
                  </p>
                  <Currency value={product.price} className="mt-3" />
                </div>

                <div className="flex flex-col items-end">
                  <ToggleHeartIcon product={product} />

                  <div className="lg:mt-9 md:mt-8 sm:mt-7 mt-10">
                    <button
                      onClick={() => {
                        setOpenSideCart(true);
                        cart.addItem(product);
                      }}
                      className="tracking-widest border-b-2 lg:text-md md:text-sm sm:text-xs text-md"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
              <SideCart open={openSideCart} setOpen={setOpenSideCart} />
            </div>
          ))}
        </div>

        {/* Show more button */}
        {filteredProducts.length > visibleProducts.length && (
          <div className="flex justify-center">
            <Button
              onClick={toggleShowMore}
              className="mt-16 text-white border-white border px-8 py-4  text-md rounded hover:bg-gray-700 "
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
