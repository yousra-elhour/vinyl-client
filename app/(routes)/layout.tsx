import getGenres from "@/actions/get-genres";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/Navbar";

export const revalidate = 0;

export default async function Layout({
  children,
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
