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
import AnimatedTitle from "./AnimatedTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css/effect-coverflow";
import "swiper/css";

interface HeroSectionProps {
  billboards: Billboard[];
  genres: Genre[];
}

const HeroSection = ({ genres, billboards }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [titleKey, setTitleKey] = useState(Date.now());
  const navigationNextRef = useRef(null);
  const navigationPrevRef = useRef(null);
  const parent = useRef(null);
  const swiperRef = useRef<SwiperType>();

  const previousSlide = () => {
    setCurrentIndex((currentIndex - 1 + billboards.length) % billboards.length);
    swiperRef.current?.slidePrev();
    setTitleKey(Date.now());
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % billboards.length);
    swiperRef.current?.slideNext();
    setTitleKey(Date.now());
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
    setIsMounted(true);
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  if (!isMounted) {
    return (
      <div
        style={{
          backgroundColor: `${currentBillboard.color}`,
        }}
        className={` auto h-screen max-w-screen justify-between current-billboard 
        }`}
      ></div>
    );
  }

  return (
    <>
      <div
        style={{
          backgroundColor: `${currentBillboard.color}`,
        }}
        className={`${textColor} auto h-screen max-w-screen justify-between current-billboard  items-center
         
        }`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <NavBar
            genres={genres}
            backgroundColor={currentBillboard.color}
            className={`${currentBillboard.color} ${textColor} z-50 current-billboard `}
          />
        </motion.div>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={5}
          effect={"coverflow"}
          centeredSlides={true}
          allowTouchMove={false}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            scale: 0.6,
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[EffectCoverflow, Navigation]}
          className="mySwiper"
        >
          {billboards.concat(billboards).map((billboard, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: [-360, 0] }}
                transition={{ duration: 0.5 }}
                whileHover={{ rotate: [-360, 0] }}
                whileTap={{ scale: 0.9 }}
                className="z-50"
              >
                {" "}
                <Image
                  className="w-auto object-contain  cursor-pointer inset-10"
                  width={0}
                  height={0}
                  sizes="auto"
                  src={billboard.imageUrl}
                  onClick={() => {
                    if (index === currentIndex) {
                      setModalOpen(true);
                    }
                  }}
                  alt="Vinyl"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <AnimatedTitle key={titleKey} text={currentBillboard.label} />
        <div className="absolute lg:bottom-[4%] lg:right-[5%] md:bottom-[3%] md:right-[5%]  bottom-[2%] right-[5%] flex gap-[3cqw] z-50">
          <button
            onClick={previousSlide}
            title="Previous slide"
            ref={navigationPrevRef}
            className="previous-slide border-white border-2 rounded-full p-2"
          >
            <ArrowLeftIcon className="lg:h-8 lg:w-8 md:h-6 md:w-6 sm:h-4 sm:w-5 h-5 w-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            ref={navigationNextRef}
            title="Next slide"
            className="next-slide border-white border-2 rounded-full p-2"
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
