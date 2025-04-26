/**
 * YouTube Music API client
 * Provides album and track data similar to Spotify but from YouTube Music
 */

// Define types to match our needs
export interface YTMusicTrack {
  title: string;
  videoId: string;
  thumbnailUrl: string;
  url: string;
  artist: string;
  album: string;
  preview_url: string; // Direct audio URL (when available) or video URL
  duration: string;
}

export interface YTMusicAlbum {
  title: string;
  artist: string;
  albumId: string;
  thumbnailUrl: string;
  year: string;
  tracks: YTMusicTrack[];
}

/**
 * Fetches album information from YouTube Music
 */
export async function fetchYTMusicAlbum(
  artist: string,
  album: string
): Promise<YTMusicAlbum | null> {
  try {
    console.log(`Searching YouTube Music for album: ${album} by ${artist}`);

    // Use our API endpoint to search for the album
    const query = encodeURIComponent(`${artist} ${album} album`);
    const response = await fetch(`/api/youtube-music/album?q=${query}`);

    if (!response.ok) {
      throw new Error(`YouTube Music API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      console.error("YouTube Music API returned error:", data.error);
      return null;
    }

    return data.album;
  } catch (error) {
    console.error("Error fetching YouTube Music album:", error);
    return null;
  }
}

/**
 * Fetches tracks for an artist/album combination
 * This is a fallback when album search doesn't work
 */
export async function fetchYTMusicTracks(
  artist: string,
  album: string,
  trackCount: number = 10
): Promise<YTMusicTrack[]> {
  try {
    console.log(
      `Searching YouTube Music for tracks from: ${album} by ${artist}`
    );

    // Use our API endpoint to search for tracks from this album
    const query = encodeURIComponent(`${artist} ${album} audio`);
    const response = await fetch(
      `/api/youtube-music/tracks?q=${query}&count=${trackCount}`
    );

    if (!response.ok) {
      throw new Error(`YouTube Music tracks API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      console.error("YouTube Music tracks API returned error:", data.error);
      return [];
    }

    return data.tracks;
  } catch (error) {
    console.error("Error fetching YouTube Music tracks:", error);
    return [];
  }
}

/**
 * Formats YouTube Music data to match Spotify's format
 * for easier integration with existing components
 */
export function formatAsSpotifyTracks(ytTracks: YTMusicTrack[]): any[] {
  return ytTracks.map((track, index) => ({
    title: track.title,
    name: track.title,
    artist: track.artist,
    artists: [{ name: track.artist }],
    album: track.album,
    preview_url: track.preview_url,
    id: track.videoId,
    uri: `youtube:track:${track.videoId}`,
    external_urls: {
      youtube: track.url,
    },
    images: [{ url: track.thumbnailUrl }],
    thumbnail: track.thumbnailUrl,
    duration_ms: 30000, // Placeholder for 30 seconds preview
    track_number: index + 1,
    // YouTube-specific fields
    videoId: track.videoId,
    ytUrl: track.url,
  }));
}

/**
 * Main function to get tracks from YouTube Music
 * Tries album search first, then falls back to individual tracks
 */
export async function getYouTubeMusicTracks(
  artist: string,
  albumTitle: string
): Promise<any[]> {
  console.log(`Getting YouTube Music tracks for ${albumTitle} by ${artist}`);

  // Try to get the full album first
  const album = await fetchYTMusicAlbum(artist, albumTitle);

  if (album && album.tracks && album.tracks.length > 0) {
    console.log(
      `Found YouTube Music album: ${album.title} with ${album.tracks.length} tracks`
    );
    const formattedTracks = formatAsSpotifyTracks(album.tracks);
    console.log(`Formatted ${formattedTracks.length} tracks to Spotify format`);
    return formattedTracks;
  }

  // Fall back to getting individual tracks
  console.log(
    `No album found for ${albumTitle}, searching for individual tracks`
  );
  const tracks = await fetchYTMusicTracks(artist, albumTitle);

  if (tracks && tracks.length > 0) {
    console.log(
      `Found ${tracks.length} tracks from YouTube Music track search`
    );
    const formattedTracks = formatAsSpotifyTracks(tracks);
    console.log(`Formatted ${formattedTracks.length} tracks to Spotify format`);
    return formattedTracks;
  }

  // Last resort: Create a simple tracks array using YouTube lyric videos
  // These are more likely to be available than official music videos
  console.log("No tracks found on YouTube Music, creating fallback tracks");

  // Create some basic track names based on common song structures
  const trackNames = [
    "Intro",
    "Verse",
    "Chorus",
    "Bridge",
    "Outro",
    "Main Theme",
    "Full Album",
  ];

  // Create fallback tracks using lyric video searches
  const fallbackTracks = trackNames.map((trackName, index) => {
    const searchTerm = `${artist} ${albumTitle} ${trackName} lyrics`;
    const videoId = `fallback_${Date.now()}_${index}`; // Placeholder

    return {
      title: `${trackName} - ${albumTitle}`,
      name: `${trackName} - ${albumTitle}`,
      artist: artist,
      artists: [{ name: artist }],
      album: albumTitle,
      id: videoId,
      preview_url: null, // We'll search for this on demand in the player component
      search_term: searchTerm, // Add custom property for search term
      uri: `youtube:search:${encodeURIComponent(searchTerm)}`,
      track_number: index + 1,
      is_fallback: true,
    };
  });

  console.log(`Created ${fallbackTracks.length} fallback tracks`);
  return fallbackTracks;
}
