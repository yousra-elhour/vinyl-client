"use client";

import Image from "next/image";
import NewsLetterForm from "./NewsLetterForm";
import { motion } from "framer-motion";

export default function NewsLetter() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="bg-lightGray pt-12 mb-24"
      >
        <h1 className=" font-header text-[8cqw] text-black mb-[-4.2cqw] px-[1.6cqw]">
          NEWSLETTER
        </h1>

        <div className="flex flex-col justify-center 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6 items-stretch gap-8  ">
          <Image
            width={0}
            height={0}
            sizes="auto"
            src="/images/newsLetter.jpg"
            alt="Newsletter"
            className="w-auto"
          />

          <NewsLetterForm />
        </div>
      </motion.div>
    </>
  );
}
