/**
 * YouTube Music search utility
 * Provides fallback music previews when Spotify previews aren't available
 */

import axios from "axios";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
}

export interface YouTubeTrack {
  title: string;
  videoId: string;
  thumbnailUrl: string;
  url: string;
}

// Cache to avoid repeated searches
const searchCache: Record<string, YouTubeTrack> = {};

/**
 * Find a YouTube video that's embeddable (to avoid "This video is unavailable")
 */
export async function getYouTubeMusicPreview(
  artist: string,
  title: string,
  forceLyrics = false
): Promise<YouTubeTrack | null> {
  try {
    // Create search terms with variations to increase chances of finding playable videos
    // Lyric videos are more commonly embeddable
    const searchTerms = [
      `${artist} ${title} lyrics`,
      `${artist} ${title} audio`,
      `${artist} ${title} official`,
      `${artist} ${title}`,
    ];

    // If there's a specific search term provided (for fallback tracks), use it first
    if (forceLyrics) {
      searchTerms.unshift(`${artist} ${title} lyrics`);
    }

    // Check cache first
    const cacheKey = `${artist}-${title}`;
    if (searchCache[cacheKey]) {
      console.log(`Found cached YouTube result for ${cacheKey}`);
      return searchCache[cacheKey];
    }

    // Try each search term until we find a video
    for (const searchTerm of searchTerms) {
      console.log(`Searching YouTube for: ${searchTerm}`);

      try {
        // Use our API endpoint to search YouTube
        const response = await fetch(
          `/api/youtube-search?q=${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) {
          console.warn(
            `Search for "${searchTerm}" failed with status ${response.status}`
          );
          continue; // Try next search term
        }

        const data = await response.json();

        if (!data.success || !data.videos || data.videos.length === 0) {
          console.warn(`No videos found for "${searchTerm}"`);
          continue; // Try next search term
        }

        // Use the first result
        const video = data.videos[0];

        const result: YouTubeTrack = {
          title: video.title,
          videoId: video.id,
          thumbnailUrl: video.thumbnailUrl,
          url: `https://www.youtube.com/watch?v=${video.id}`,
        };

        // Cache the result
        searchCache[cacheKey] = result;

        console.log(`Found YouTube video: ${result.title} (${result.videoId})`);
        return result;
      } catch (searchError) {
        console.error(`Error searching "${searchTerm}":`, searchError);
        // Continue to next search term
      }
    }

    console.warn(`Could not find any YouTube video for ${artist} - ${title}`);
    return null;
  } catch (error) {
    console.error("Error in getYouTubeMusicPreview:", error);
    return null;
  }
}

/**
 * Function to get a track by direct search term
 * This is used for fallback tracks with search_term property
 */
export async function getTrackBySearchTerm(
  searchTerm: string
): Promise<YouTubeTrack | null> {
  try {
    // Check if we already searched for this term
    const cacheKey = `search-${searchTerm}`;
    if (searchCache[cacheKey]) {
      return searchCache[cacheKey];
    }

    console.log(`Searching YouTube for term: ${searchTerm}`);

    // Use our API endpoint to search YouTube
    const response = await fetch(
      `/api/youtube-search?q=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error(`YouTube search failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.videos || data.videos.length === 0) {
      console.warn(`No videos found for "${searchTerm}"`);
      return null;
    }

    // Use the first result
    const video = data.videos[0];

    const result: YouTubeTrack = {
      title: video.title,
      videoId: video.id,
      thumbnailUrl: video.thumbnailUrl,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    };

    // Cache the result
    searchCache[cacheKey] = result;

    console.log(
      `Found YouTube video for search term: ${result.title} (${result.videoId})`
    );
    return result;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return null;
  }
}
