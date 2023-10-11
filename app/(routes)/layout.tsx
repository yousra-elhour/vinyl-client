import getGenres from "@/actions/get-genres";
import getProducts from "@/actions/get-products";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/Navbar";

const cartProducts = [
  {
    id: 1,
    band: "Beach House",
    href: "#",
    imageSrc: "/images/albums/bloom-lp.jpg",
    imageAlt: "Album Cover",
    price: "350.00DH",
    album: "Bloom",
    quantity: 2,
    inStock: true,
  },
  {
    id: 2,
    band: "Men I Trust",
    href: "#",
    imageSrc: "/images/albums/untourableAlbum-lp.jpg",
    imageAlt: "Album Cover",
    price: "350.00DH",
    album: "Untourable Album",
    quantity: 1,
    inStock: false,
    leadTime: "2-4 weeks",
  },
  {
    id: 3,
    band: "Cocteau Twins",
    href: "#",
    imageSrc: "/images/albums/heavenOrLasVegas.jpg",
    imageAlt: "Album Cover",
    price: "350.00DH",
    album: "Heaven Or Las Vegas",
    quantity: 3,
    inStock: true,
  },
];

export const revalidate = 0;

export default async function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const genres = await getGenres();

  return (
    <>
      <NavBar genres={genres} />
      {children}

      <Footer />
    </>
  );
}
