import ListProducts from "@/components/ui/ListProducts";
import Filter from "@/components/ui/Filter";
import getProducts from "@/actions/get-products";
import getGenres from "@/actions/get-genres";

export const revalidate = 0;

interface ListPageProps {
  params: {
    genreId: string;
  };
  searchParams: {
    genreId: string;
    sort: string;
    search: string;
  };
}

const ListPage = async ({ params, searchParams }: ListPageProps) => {
  const products = await getProducts({
    genreId: searchParams.genreId,
    sort: searchParams.sort,
    search: searchParams.search,
  });

  const search = {
    genreId: searchParams.genreId,
    sort: searchParams.sort,
    search: searchParams,
  };

  const genres = await getGenres();
  return (
    <div>
      <Filter initialData={search} name="Genres" genres={genres} />
      <ListProducts
        className="lg:py-0 md:py-0 sm:py-0 py-0"
        products={products}
      />
    </div>
  );
};

export default ListPage;
