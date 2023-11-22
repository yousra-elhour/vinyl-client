import dotenv from "dotenv"; // Import the dotenv library

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export async function fetchTracks(query: string) {
  const maxRetries = 3; // Adjust the number of retries as needed
  const retryDelay = 3000; // Adjust the delay between retries in milliseconds

  try {
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    // Get request using search to get Album ID
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      authParameters
    );
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    let attempts = 0;
    let albumData;

    do {
      if (attempts > 0) {
        console.log(`Retrying (${attempts}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }

      const albumResponse = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=album&limit=1",
        searchParameters
      );

      albumData = await albumResponse.json();

      attempts++;
    } while (
      attempts < maxRetries &&
      (!albumData.albums ||
        !albumData.albums.items ||
        albumData.albums.items.length === 0)
    );

    if (
      !albumData.albums ||
      !albumData.albums.items ||
      albumData.albums.items.length === 0
    ) {
      throw new Error("No albums found");
    }

    const albumId = albumData.albums.items[0].id;

    // Continue with the rest of your code...

    const albumTracks = await fetch(
      "https://api.spotify.com/v1/albums/" +
        albumId +
        "/tracks?offset=0&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        // Check if items is defined and not an empty array
        const tracks = (data.items || []).map((item: any) => ({
          title: item.name,
          artist: item.artists[0].name,
          preview_url: item.preview_url,
        }));

        return tracks;
      })
      .catch((error) => {
        console.error("Error fetching album tracks:", error);
        // Handle the error appropriately, you might want to throw it further or log it
      });

    return {
      albumId: albumId,
      albumTracks: albumTracks,
    };
  } catch (error) {
    console.error("Error fetching album ID:", error);
    // Handle the error appropriately, you might want to throw it further or log it
    throw error; // Rethrow the error to be caught by the caller
  }
}
