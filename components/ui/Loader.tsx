"use client";

import { PuffLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      className="
      h-[100vh]
      flex 
      flex-col 
      justify-center 
      items-center 
    "
    >
      <PuffLoader size={100} color="#fff" />
    </div>
  );
};

export default Loader;
