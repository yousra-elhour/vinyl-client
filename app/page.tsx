import ListProducts from "@/components/ui/ListProducts";
import HeroSection from "@/components/ui/HeroSection";
import NewsLetter from "@/components/ui/Newsletter";
import Footer from "@/components/ui/Footer";
import getGenres from "@/actions/get-genres";
import getBillboards from "@/actions/get-billboards";
import getProducts from "@/actions/get-products";

export const revalidate = 0;

export default async function Home() {
  const genres = await getGenres();
  const billboards = await getBillboards();
  const featuredProducts = await getProducts({ isFeatured: true });
  const products = await getProducts({});

  return (
    <div>
      <HeroSection billboards={billboards} genres={genres} />
      <ListProducts
        title="BEST SELLERS"
        products={featuredProducts}
        hasSlider={true}
      />
      <ListProducts
        title="LATEST RELEASES"
        products={products}
        hasSlider={true}
      />
      <NewsLetter />
      <Footer />
    </div>
  );
}
