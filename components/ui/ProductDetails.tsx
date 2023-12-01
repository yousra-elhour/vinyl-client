import { Product } from "@/types";
import Image from "next/image";
import AddToCart from "./AddToCart";
import { fetchTracks } from "@/utils";
import MusicPlayer from "./MusicPlayer";
import ListProducts from "./ListProducts";
import getProducts from "@/actions/get-products";
import Currency from "./Currency";

interface ProductDetailsProps {
  product: Product;
}

export default async function ProductDetails({ product }: ProductDetailsProps) {
  const spotifyApi = await fetchTracks(`${product.album} ${product.artist}`);
  const albumTracks = spotifyApi?.albumTracks;

  const suggestedProducts = await getProducts({ genreId: product?.genre?.id });

  return (
    <>
      <div className="sm:pt-16 pb-32  overflow-hidden">
        <div className="2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6 ">
          <div className="flex  flex-wrap-reverse justify-center items-center ">
            <div className="w-full lg:w-1/2  mb-8 lg:mb-0">
              <div className="flex   items-center justify-between lg:justify-start lg:items-start xl:items-center ">
                <div className="flex relative flex-auto flex-grow  sm:w-9/12 px-4">
                  <Image
                    width={0}
                    height={0}
                    placeholder="empty"
                    sizes="auto"
                    src={product.imageUrl}
                    alt="Current Cover"
                    className="z-20 w-[75%]"
                  />
                  <Image
                    width={0}
                    height={0}
                    sizes="auto"
                    src="/images/default-vinyl.png"
                    alt="Current Vinyl"
                    className="left-[20%] bottom-[-9%] absolute  lg:w-[84%]  md:w-[84%] sm:w-[82%] w-[80%]"
                  />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-[7cqw] mb-8">
              <div className=" mb-6">
                <h2 className="mt-6 mb-2 text-5xl md:text-4xl lg:text-5xl font-heading font-header">
                  {product.album}
                </h2>
                <p className="flex items-center mb-10 ">
                  <span className="text-xl  font-light">{product.artist}</span>
                </p>

                <Currency
                  value={product.price}
                  className="font-header text-3xl mb-10 md:text-3xl sm:text-3xl lg:text-3xl"
                />
                <p className="text-md text-gray-400 text-justify mb-10">
                  {product.description}
                </p>

                {/* <p className="mb-10 flex space-x-2 text-sm text-gray-400">
                  {product.inStock ? (
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
                    {product.inStock
                      ? "In stock"
                      : `Ships in ${product.leadTime}`}
                  </span>
                </p> */}
              </div>

              {product.isSpotify && <MusicPlayer albumTracks={albumTracks} />}
              <AddToCart data={product} />
            </div>
          </div>
        </div>
      </div>

      <div className="2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6">
        <ListProducts
          products={suggestedProducts}
          hasSlider={true}
          currentProduct={product}
        />
      </div>
    </>
  );
}
