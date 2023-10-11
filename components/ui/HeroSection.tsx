"use client";

import NavBar from "@/components/ui/Navbar";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import color from "color";
import Link from "next/link";
import { X } from "lucide-react";
import { Billboard, Genre } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import autoAnimate from "@formkit/auto-animate";

interface HeroSectionProps {
  billboards: Billboard[];
  genres: Genre[];
}

const HeroSection = ({ genres, billboards }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const parent = useRef(null);

  const previousSlide = () => {
    setCurrentIndex((currentIndex - 1 + billboards.length) % billboards.length);
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % billboards.length);
  };

  const currentBillboard = billboards[currentIndex];

  const previousIndex =
    (currentIndex - 1 + billboards.length) % billboards.length;
  const nextIndex = (currentIndex + 1) % billboards.length;

  const modalColor = color(currentBillboard.color)
    .saturate(-0.4)
    .darken(0.4)
    .hex();

  const textColor = "text-white";

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <>
      <div
        style={{
          backgroundColor: `${currentBillboard.color}`,
        }}
        className={`${textColor} auto h-screen max-w-screen justify-between current-billboard 
         
        }`}
      >
        <NavBar
          genres={genres}
          backgroundColor={currentBillboard.color}
          className={`${currentBillboard.color} ${textColor} z-50 current-billboard `}
        />
        <AnimatePresence>
          <motion.div
            animate={{ opacity: 1 }}
            transition={{
              opacity: { ease: "linear" },
            }}
            style={{ backgroundColor: `${currentBillboard.color}` }}
            className={` ${textColor} relative main flex items-center justify-center 3xl:h-[80vh]  lg:h-[80vh]  h-4/6 overflow-hidden current-billboard  `}
            ref={parent}
          >
            {/* Previous Image */}

            <Image
              src={billboards[previousIndex].imageUrl}
              width={0}
              height={0}
              sizes="auto"
              alt="Previous Vinyl"
              className={`w-auto absolute z-10 object-contain max-w-screen lg:h-[25cqw] md:h-[30cqw] sm:h-[33cqw] h-[40cqw] cursor-pointer transition-opacity opacity-0 duration-[1s] ${
                currentIndex === previousIndex ? "vinyl-animation previous" : ""
              }`}
              onLoadingComplete={(image) => image.classList.remove("opacity-0")}
              style={{
                left: "10%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              priority
            />

            {/* Current Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: [-360, 0] }}
              transition={{ duration: 0.5 }}
              whileHover={{ rotate: [-360, 0] }}
              whileTap={{ scale: 0.9 }}
              className="z-50"
            >
              <Image
                src={currentBillboard.imageUrl}
                width={0}
                height={0}
                sizes="auto"
                onClick={() => setModalOpen(true)}
                alt="Current Vinyl"
                className={`w-auto object-contain z-50 max-w-screen  lg:h-[39cqw] md:h-[45cqw] sm:h-[55cqw] h-[70cqw] cursor-pointer transition-opacity opacity-0 duration-[1s] ${
                  currentIndex === previousIndex
                    ? "vinyl-animation next"
                    : currentIndex === nextIndex
                    ? "vinyl-animation previous"
                    : ""
                }`}
                onLoadingComplete={(image) =>
                  image.classList.remove("opacity-0")
                }
                priority
              />
            </motion.div>

            {/* Next Image */}

            <Image
              src={billboards[nextIndex].imageUrl}
              width={0}
              height={0}
              sizes="auto"
              alt="Next Vinyl"
              className={`w-auto absolute z-10 object-contain max-w-screen lg:h-[25cqw] md:h-[30cqw] sm:h-[33cqw] h-[40cqw] cursor-pointer transition-opacity opacity-0 duration-[1s] ${
                currentIndex === nextIndex ? "vinyl-animation next" : ""
              }`}
              onLoadingComplete={(image) => image.classList.remove("opacity-0")}
              style={{
                right: "10%",
                top: "50%",
                transform: "translate(50%, -50%)",
              }}
              priority
            />

            <div className="absolute z-0 font-bold heroTitle lg:leading-[28cqw] md:leading-loose sm:leading-[50cqw] leading-[70cqw]">
              {currentBillboard.label.split(" ").map((word, index) => (
                <div key={index}>
                  {index === 0 ? (
                    <motion.span className="block">{word}</motion.span>
                  ) : (
                    <motion.span>{word}</motion.span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute lg:bottom-[4%] lg:right-[5%] md:bottom-[3%] md:right-[5%]  bottom-[2%] right-[5%] flex gap-[3cqw] z-50">
          <button
            onClick={previousSlide}
            title="Previous slide"
            className="border-white border-2 rounded-full p-2"
          >
            <ArrowLeftIcon className="lg:h-8 lg:w-8 md:h-6 md:w-6 sm:h-4 sm:w-5 h-5 w-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            title="Next slide"
            className="border-white border-2 rounded-full p-2"
          >
            <ArrowRightIcon className="lg:h-8 lg:w-8 md:h-6 md:w-6 sm:h-5 sm:w-5 h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { ease: "linear" },
              layout: { duration: 0.3 },
            }}
            style={{ backgroundColor: `${modalColor}` }}
            className={` ${textColor} z-[99999] fixed inset-0 max-w-screen flex justify-center items-center min-h-screen`}
          >
            <div className="flex lg:flex-row  md:flex-row lg:gap-[18cqw] md:gap-[15cqw] sm:gap-20 gap-10 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6 items-center justify-center sm:flex-col-reverse flex-col-reverse lg:text-justify md:text-justify sm:text-center lg:flex-nowrap md:flex-nowrap sm:flex-wrap-reverse flex-wrap-reverse text-center">
              <div className="flex relative flex-auto flex-grow">
                <Image
                  src={currentBillboard.cover}
                  alt="Current Cover"
                  width={0}
                  height={0}
                  sizes="auto"
                  className="z-20  lg:w-[30cqw] md:w-[60cqw] sm:w-[40cqw] w-[40cqw]"
                />
                <Image
                  src={currentBillboard.imageUrl}
                  width={0}
                  height={0}
                  sizes="auto"
                  alt="Current Vinyl"
                  className="left-[45%] absolute sm:w-[40cqw] w-[40cqw] "
                />
              </div>
              <div className="flex flex-col lg:gap-20 md:gap-10 sm:gap-5 gap-5 flex-auto lg:max-w-xl md:max-w-md lg:mx-0 md:mx-0  sm:mx-[10%] mx-[10%] justify-center grow-0">
                <div className="flex flex-col lg:gap-10 md:gap-7 sm:gap-5 gap-5">
                  <h1 className="lg:text-5xl md:text-3xl sm:text-xl text-lg font-bold mt-2 font-header ">
                    {currentBillboard.label}
                  </h1>
                  <p className="lg:text-2xl md:text-lg sm:text-md text-sm leading-loose font-thin lg:text-justify md:text-justify sm:text-center lg:px-0 md:px-0 sm:px-10 px-10">
                    {currentBillboard.description}
                  </p>
                </div>

                <div>
                  <Link href={`/product/${currentBillboard.productId}`}>
                    <Button
                      title="Purchase"
                      color="white"
                      className="font-header rounded-none lg:text-2xl md:text-lg sm:text-md text-sm  border-2 inline lg:px-12 md:px-8 sm:px-4 px-4  lg:py-4 md:py-2 py-2 border-white bg-transparent text-white hover:bg-white hover:text-black active:opacity-100"
                    >
                      Purchase
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <button
              title="Close"
              className="absolute lg:bottom-[5%] lg:right-[5%] md:bottom-[5%] md:right-[5%]  bottom-[5%] right-[5%] text-gray-100 hover:text-gray-300 transition-all"
              onClick={() => setModalOpen(false)}
            >
              <X className="h-8 w-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
