import ProductDetails from "@/components/ui/ProductDetails";
import getProduct from "@/actions/get-product";
import { fetchTracks } from "@/utils";
import getProducts from "@/actions/get-products";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId);
  const spotifyApi = await fetchTracks(`${product.album} ${product.artist}`);
  const albumTracks = await spotifyApi.albumTracks;
  const suggestedProducts = await getProducts({ genreId: product?.genre?.id });
  return (
    <div>
      <ProductDetails
        albumTracks={albumTracks}
        suggestedProducts={suggestedProducts}
        product={product}
      />
    </div>
  );
}
