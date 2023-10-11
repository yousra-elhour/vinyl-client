import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products/`;

const getProduct = async (id: string): Promise<Product> => {
  try {
    const res = await fetch(`${URL}/${id}`);

    if (!res.ok) {
      console.error(
        `Error fetching Product - HTTP Status: ${res.status}, Message: ${res.statusText}`
      );
      throw new Error("Network response was not ok");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export default getProduct;
