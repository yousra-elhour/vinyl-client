import qs from "query-string";
import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  genreId?: string;
  sort?: string;
  isFeatured?: boolean;
  search?: string;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  try {
    // Create a base query object with default parameters
    const baseQuery: Query = {
      genreId: query.genreId,
      sort: query.sort,
      isFeatured: query.isFeatured,
    };

    // Conditionally add the search parameter if it's provided
    if (query.search) {
      baseQuery.search = query.search;
    }

    // Use type assertion to bypass TypeScript's type checking for 'query'
    const url = qs.stringifyUrl({
      url: URL,
      query: baseQuery as any, // Type assertion here
    });

    const res = await fetch(url);

    if (!res.ok) {
      console.error(
        `Error fetching Products - HTTP Status: ${res.status}, Message: ${res.statusText}`
      );
      throw new Error("Network response was not ok");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

export default getProducts;
