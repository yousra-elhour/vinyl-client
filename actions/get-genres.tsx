import { Genre } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/genres`;

const getGenres = async (): Promise<Genre[]> => {
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      console.error(
        `Error fetching genres - HTTP Status: ${res.status}, Message: ${res.statusText}`
      );
      throw new Error("Network response was not ok");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

export default getGenres;
