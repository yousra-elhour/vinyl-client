import { Genre } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/genres/`;

const getGenre = async (id: string): Promise<Genre> => {
  try {
    const res = await fetch(`${URL}/${id}`);

    if (!res.ok) {
      console.error(
        `Error fetching Genre - HTTP Status: ${res.status}, Message: ${res.statusText}`
      );
      throw new Error("Network response was not ok");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching Genre:", error);
    throw error;
  }
};

export default getGenre;
