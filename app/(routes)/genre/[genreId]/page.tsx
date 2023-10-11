import getGenre from "@/actions/get-genre";
import getProducts from "@/actions/get-products";
import ListProducts from "@/components/ui/ListProducts";

export const revalidate = 0;

interface GenrePageProps {
  params: {
    genreId: string;
  };
}

const GenrePage = async ({ params }: GenrePageProps) => {
  const products = await getProducts({
    genreId: params.genreId,
  });
  const genre = await getGenre(params.genreId);
  return (
    <>
      <ListProducts products={products} genre={genre} />
    </>
  );
};

export default GenrePage;
