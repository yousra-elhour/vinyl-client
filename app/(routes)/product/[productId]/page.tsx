import ProductDetails from "@/components/ui/ProductDetails";
import getProduct from "@/actions/get-product";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId);
  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
}
