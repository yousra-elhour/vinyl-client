import dotenv from "dotenv"; // Import the dotenv library

// Only configure dotenv in development for local testing
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log("Environment variables loaded in development mode");
}

// For client-side, Next.js only exposes variables prefixed with NEXT_PUBLIC_
// For server-side, both regular and NEXT_PUBLIC_ variables are available
const isServer = typeof window === "undefined";
console.log("Running on:", isServer ? "server-side" : "client-side");

// Log environment information
console.log("Environment:", {
  ENV_TYPE: process.env.NODE_ENV,
  IS_SERVER: isServer,
});

export async function fetchTracks(query: string) {
  try {
    console.log("Fetching tracks for query:", query);

    // Use the new Deezer API route instead of Spotify
    const apiUrl = `/api/deezer?query=${encodeURIComponent(query)}`;
    console.log("Calling Deezer API at:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("API request failed with status:", response.status);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return { albumTracks: [] };
    }

    const data = await response.json();
    console.log("Deezer tracks received:", data.albumTracks?.length || 0);
    return data;
  } catch (error) {
    console.error("Error in fetchTracks:", error);
    return { albumTracks: [] };
  }
}

// Add a function to get a random track from Deezer
export async function fetchRandomTrack() {
  try {
    // Generate a random track ID between 10,000 and 10,000,000
    // This is a trick that works with Deezer's track ID system
    const min = 10000;
    const max = 10000000;
    const randomTrackId = Math.floor(Math.random() * (max - min + 1)) + min;

    console.log("Fetching random track with ID:", randomTrackId);

    const response = await fetch(
      `https://api.deezer.com/track/${randomTrackId}`
    );

    if (!response.ok) {
      // If track not found, try another random ID
      if (response.status === 404) {
        console.log("Track not found, trying another random ID");
        return fetchRandomTrack(); // Recursive call
      }

      console.error("API request failed with status:", response.status);
      return null;
    }

    const track = await response.json();

    return {
      title: track.title,
      artist: track.artist.name,
      preview_url: track.preview,
      album: track.album.title,
      duration: track.duration,
      album_cover: track.album.cover_medium,
    };
  } catch (error) {
    console.error("Error fetching random track:", error);
    return null;
  }
}

// Keep these functions for server-side use or if needed for other purposes
// but they won't be used by the client-side fetchTracks anymore
async function searchByAlbum(query: string, searchParameters: any) {
  try {
    // Get album ID
    console.log("Searching for album:", query);
    const albumResponse = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        encodeURIComponent(query) +
        "&type=album&limit=1",
      searchParameters
    );

    if (!albumResponse.ok) {
      // Handle token expiration
      if (albumResponse.status === 401) {
        console.log("Token expired, refreshing...");
        await getAccessToken();
        return []; // Caller will retry with new token
      }

      console.error("Album search failed, status:", albumResponse.status);
      const errorText = await albumResponse.text();
      console.error("Error response:", errorText);
      return [];
    }

    const albumData = await albumResponse.json();
    console.log(
      "Album search complete response:",
      JSON.stringify(albumData, null, 2)
    );

    // Check if 'items' exists in the response
    const items = albumData.albums?.items || [];

    if (items.length === 0) {
      console.log("No albums found, returning empty tracks");
      return [];
    }

    const albumId = items[0].id;
    console.log("Found album ID:", albumId);

    // Get tracks for the album
    console.log("Fetching tracks for album:", albumId);
    const tracksResponse = await fetch(
      "https://api.spotify.com/v1/albums/" +
        albumId +
        "/tracks?offset=0&limit=50",
      searchParameters
    );

    if (!tracksResponse.ok) {
      console.error("Failed to fetch tracks, status:", tracksResponse.status);
      return [];
    }

    const tracksData = await tracksResponse.json();
    console.log(
      "Album tracks complete response:",
      JSON.stringify(tracksData, null, 2)
    );

    // Map the tracks to a simplified format
    const tracks = (tracksData.items || []).map((item: any) => ({
      title: item.name,
      artist: item.artists[0].name,
      preview_url: item.preview_url,
    }));

    console.log(
      `Found ${tracks.length} tracks, with preview URLs: ${
        tracks.filter((t: { preview_url: string | null }) => t.preview_url)
          .length
      }`
    );

    return tracks;
  } catch (error) {
    console.error("Error in searchByAlbum:", error);
    return [];
  }
}

async function searchByTrack(query: string, searchParameters: any) {
  try {
    console.log("Searching for tracks directly:", query);
    const trackResponse = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        encodeURIComponent(query) +
        "&type=track&limit=10",
      searchParameters
    );

    if (!trackResponse.ok) {
      console.error("Track search failed, status:", trackResponse.status);
      return [];
    }

    const trackData = await trackResponse.json();
    console.log(
      "Track search complete response:",
      JSON.stringify(trackData, null, 2)
    );

    // Check if 'items' exists in the response
    const tracks = trackData.tracks?.items || [];

    if (tracks.length === 0) {
      console.log("No tracks found in direct track search");
      return [];
    }

    // Map the tracks to a simplified format
    const formattedTracks = tracks.map((item: any) => ({
      title: item.name,
      artist: item.artists[0].name,
      preview_url: item.preview_url,
    }));

    console.log(
      `Found ${formattedTracks.length} tracks directly, with preview URLs: ${
        formattedTracks.filter(
          (t: { preview_url: string | null }) => t.preview_url
        ).length
      }`
    );

    return formattedTracks;
  } catch (error) {
    console.error("Error in searchByTrack:", error);
    return [];
  }
}

async function searchByArtist(query: string, searchParameters: any) {
  try {
    // Extract artist name - assume it's the part after the album
    const parts = query.split(" ");
    const artistName = parts.length > 1 ? parts[parts.length - 1] : query;

    console.log("Searching for top tracks by artist:", artistName);

    // First, find the artist ID
    const artistResponse = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        encodeURIComponent(artistName) +
        "&type=artist&limit=1",
      searchParameters
    );

    if (!artistResponse.ok) {
      console.error("Artist search failed, status:", artistResponse.status);
      return [];
    }

    const artistData = await artistResponse.json();
    console.log(
      "Artist search complete response:",
      JSON.stringify(artistData, null, 2)
    );

    const artists = artistData.artists?.items || [];

    if (artists.length === 0) {
      console.log("No artists found");
      return [];
    }

    const artistId = artists[0].id;
    console.log("Found artist ID:", artistId);

    // Get top tracks for the artist
    const topTracksResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      searchParameters
    );

    if (!topTracksResponse.ok) {
      console.error(
        "Top tracks fetch failed, status:",
        topTracksResponse.status
      );
      return [];
    }

    const topTracksData = await topTracksResponse.json();
    console.log(
      "Top tracks complete response:",
      JSON.stringify(topTracksData, null, 2)
    );

    const topTracks = topTracksData.tracks || [];

    // Map the tracks to a simplified format
    const formattedTracks = topTracks.map((item: any) => ({
      title: item.name,
      artist: item.artists[0].name,
      preview_url: item.preview_url,
    }));

    console.log(
      `Found ${
        formattedTracks.length
      } top tracks for artist, with preview URLs: ${
        formattedTracks.filter(
          (t: { preview_url: string | null }) => t.preview_url
        ).length
      }`
    );

    return formattedTracks;
  } catch (error) {
    console.error("Error in searchByArtist:", error);
    return [];
  }
}
