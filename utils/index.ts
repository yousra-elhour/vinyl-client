import dotenv from "dotenv"; // Import the dotenv library

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export async function fetchTracks(query: string) {
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
  return fetch("https://accounts.spotify.com/api/token", authParameters)
    .then((result) => result.json())
    .then(async (data) => {
      const accessToken = data.access_token;
      var searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      // Get album ID
      const albumId = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=album&limit=1",
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          return data.albums.items[0].id;
        });

      const albumTracks = await fetch(
        "https://api.spotify.com/v1/albums/" +
          albumId +
          "/tracks?offset=0&limit=50",
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          const tracks = data.items.map((item: any) => ({
            title: item.name,
            artist: item.artists[0].name,
            preview_url: item.preview_url,
          }));

          return tracks;
        });

      const albumImage = await fetch(
        "https://api.spotify.com/v1/albums/" + albumId,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          const url = data.images[0].url;
          return url;
        });

      return {
        albumId: albumId,
        albumTracks: albumTracks,
        albumImage: albumImage,
      };
    });
}
