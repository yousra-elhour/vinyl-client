"use client";

import ListProducts from "@/components/ui/ListProducts";
import useShortlist from "@/hooks/use-shortlist";

const ShortlistPage = () => {
  const shortlist = useShortlist();
  const shortlistedProducts = shortlist.items;
  return (
    <div>
      <ListProducts
        shortlistTitle="Shortlisted Vinyls"
        products={shortlistedProducts}
      />
    </div>
  );
};

export default ShortlistPage;
