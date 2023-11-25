import dotenv from "dotenv"; // Import the dotenv library

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let accessToken = ""; // Store the access token globally
let refreshToken = ""; // Store the refresh token globally

async function getAccessToken() {
  try {
    const authParameters = {
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

    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      authParameters
    );
    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;
    refreshToken = tokenData.refresh_token || refreshToken; // Update refresh token if a new one is provided
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

async function refresh() {
  try {
    const refreshParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    const refreshResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      refreshParameters
    );

    const refreshData = await refreshResponse.json();

    if (refreshData.error) {
      console.error("Error refreshing token:", refreshData.error);
      // Handle the error, e.g., retrying or re-authenticating the user
      return;
    }

    // Update the global accessToken variable with the new access token
    accessToken = refreshData.access_token;
    refreshToken = refreshData.refresh_token || refreshToken; // Update refresh token if a new one is provided
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Handle the error, e.g., retrying or re-authenticating the user
  }
}

export async function fetchTracks(query: string) {
  try {
    if (!accessToken) {
      await getAccessToken(); // Get initial access token
    }

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get album ID
    const albumResponse = await fetch(
      "https://api.spotify.com/v1/search?q=" + query + "&type=album&limit=1",
      searchParameters
    );

    const albumData = await albumResponse.json();

    // Check if 'items' exists in the response
    const items = albumData.albums?.items || [];

    if (items.length === 0) {
      // Attempt to refresh the token if no items are found
      await refresh();
      return fetchTracks(query); // Retry the fetchTracks function
    }

    const albumId = items[0].id;

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
        return []; // Return an empty array in case of an error
      });

    return {
      albumId: albumId,
      albumTracks: albumTracks,
    };
  } catch (error) {
    console.error("Error fetching album ID:", error);
    throw error;
  }
}
