import { Skeleton } from "./skeleton";

export default function SkeletonList() {
  return (
    <>
      <div
        className={` max-w-screen 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6  pb-16 lg:max-w-screen }`}
      >
        <div
          className={`lg:mt-16 md:mt-16 sm:mt-10 mt-10 grid grid-cols-1 lg:gap-x-20 md:gap-x-10 sm:gap-x-6 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-25`}
        >
          {Array.from({ length: 3 }, (_, i) => i + 1).map((id) => (
            <div key={id} className="group relative w-[100%]">
              <Skeleton className="w-[100%] h-[25cqw] overflow-hidden group-hover:opacity-75 bg-gray-800" />

              <div className="mt-2 flex justify-between w-[100%]">
                <div className="w-[100%] mt-6 flex justify-between ">
                  <Skeleton className="w-[100%] h-[1.5cqw] bg-gray-800"></Skeleton>
                </div>
              </div>
              <Skeleton className="mt-4 w-[100%] h-[1.5cqw] bg-gray-800"></Skeleton>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
