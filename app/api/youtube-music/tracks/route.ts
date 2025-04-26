import { NextRequest, NextResponse } from "next/server";
import { YTMusicTrack } from "@/utils/youtubeMusic";

/**
 * YouTube Music Tracks API route
 * This searches for individual tracks from YouTube Music
 */
export async function GET(request: NextRequest) {
  try {
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const countParam = searchParams.get("count");

    // Parse count parameter or default to 10
    const count = countParam ? parseInt(countParam, 10) : 10;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Missing search query" },
        { status: 400 }
      );
    }

    // Search for tracks
    const tracks = await searchYouTubeMusicTracks(query, count);

    if (!tracks || tracks.length === 0) {
      return NextResponse.json(
        { success: false, error: "No tracks found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tracks,
    });
  } catch (error) {
    console.error("YouTube Music tracks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch YouTube Music tracks" },
      { status: 500 }
    );
  }
}

/**
 * Searches for tracks on YouTube Music
 */
async function searchYouTubeMusicTracks(
  query: string,
  limit: number = 10
): Promise<YTMusicTrack[]> {
  try {
    // Add "song" to the query to prioritize song results
    const searchUrl = `https://music.youtube.com/search?q=${encodeURIComponent(
      query + " song"
    )}&hl=en&gl=US`;

    console.log(`Searching YouTube Music for tracks with URL: ${searchUrl}`);

    // Fetch the search page
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch YouTube Music search: ${response.status}`
      );
    }

    const html = await response.text();
    console.log("YouTube Music tracks HTML response length:", html.length);
    console.log(
      "YouTube Music tracks HTML first 500 chars:",
      html.substring(0, 500)
    );

    // Let's log whether key patterns exist in the HTML
    console.log("HTML contains videoId:", html.includes("videoId"));
    console.log(
      "HTML contains playlistItemData:",
      html.includes("playlistItemData")
    );
    console.log(
      "HTML contains musicResponsiveListItemRenderer:",
      html.includes("musicResponsiveListItemRenderer")
    );

    // Updated regex patterns that match more variations of YouTube Music's HTML structure
    // This pattern looks for video entries in the search results
    const tracks: YTMusicTrack[] = [];

    // Try different regex patterns to extract track information
    // Pattern 1: Standard song pattern
    const songRegex =
      /"videoId":"([^"]+)".*?"text":"([^"]+)".*?"lengthText":\{"runs":\[\{"text":"([^"]+)"\}\].*?"text":"([^"]+)".*?(?:"text":"([^"]+)")?/g;

    let match;
    let counter = 0;

    // Extract all matching tracks up to the limit
    while ((match = songRegex.exec(html)) !== null && counter < limit) {
      try {
        const [, videoId, title, duration, artist, album = "Unknown Album"] =
          match;
        if (!videoId || !title) continue; // Skip if missing essential info

        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const preview_url = `https://music.youtube.com/watch?v=${videoId}`;

        // Try to find thumbnail
        const thumbnailRegex = new RegExp(
          `"videoId":"${videoId}".*?"thumbnails":\\[\\{"url":"([^"]+)"`,
          "s"
        );
        const thumbnailMatch = html.match(thumbnailRegex);
        const thumbnailUrl = thumbnailMatch ? thumbnailMatch[1] : "";

        console.log(`Found track with Pattern 1: ${title} by ${artist}`);

        tracks.push({
          title,
          videoId,
          url,
          preview_url,
          duration,
          artist,
          album,
          thumbnailUrl,
        });

        counter++;
      } catch (err) {
        console.error("Error parsing track:", err);
      }
    }

    console.log(`Found ${tracks.length} tracks with Pattern 1`);

    // If we didn't find anything with the first pattern, try a simpler approach
    if (tracks.length === 0) {
      console.log("No tracks found with Pattern 1, trying Pattern 2");

      // Pattern 2: Simpler pattern focusing just on videoId and title
      const videoRegex =
        /"videoId":"([^"]+)".*?"title":\{(?:[^}]+)?\}.*?"text":"([^"]+)"/g;

      counter = 0;
      while ((match = videoRegex.exec(html)) !== null && counter < limit) {
        try {
          const [, videoId, title] = match;
          if (!videoId || !title) continue;

          const url = `https://www.youtube.com/watch?v=${videoId}`;
          const preview_url = `https://music.youtube.com/watch?v=${videoId}`;

          // Use parts of the search query for artist/album when not found
          const queryParts = query.split(" ");
          const artist = queryParts[0] || "Unknown Artist";
          const possibleAlbum =
            queryParts.length > 1 ? queryParts[1] : "Unknown Album";

          console.log(`Found track with Pattern 2: ${title}`);

          tracks.push({
            title,
            videoId,
            url,
            preview_url,
            duration: "0:30", // Default duration for preview
            artist,
            album: possibleAlbum,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, // Default thumbnail
          });

          counter++;
        } catch (err) {
          console.error("Error parsing track with Pattern 2:", err);
        }
      }

      console.log(`Found ${tracks.length} tracks with Pattern 2`);
    }

    // Last resort pattern - if still no tracks found
    if (tracks.length === 0) {
      console.log(
        "No tracks found with Pattern 2, using last resort Pattern 3"
      );

      // Let's log a small snippet where videoId might be found
      const sampleSnippet =
        html.indexOf("videoId") > -1
          ? html.substring(
              html.indexOf("videoId") - 10,
              html.indexOf("videoId") + 50
            )
          : "Not found";
      console.log("Sample videoId snippet:", sampleSnippet);

      // Pattern 3: Ultra-simple pattern just to find videoIds - more permissive
      const simpleVideoRegex = /videoId["\s:=]+([a-zA-Z0-9_-]{11})/g;
      const videoIds = new Set();

      while (
        (match = simpleVideoRegex.exec(html)) !== null &&
        videoIds.size < limit
      ) {
        const videoId = match[1];
        if (videoId && videoId.length >= 11) {
          // YouTube videoIds are usually 11 chars
          videoIds.add(videoId);
          console.log("Found videoId:", videoId);
        }
      }

      console.log(`Found ${videoIds.size} video IDs with Pattern 3`);

      // If still nothing, try an even more basic approach
      if (videoIds.size === 0) {
        console.log("Using ultra-basic Pattern 4 to find ANY YouTube videoIds");

        // This pattern looks for ANY 11-character sequence that looks like a YouTube videoId
        const basicIdRegex = /["':=\s][a-zA-Z0-9_-]{11}["',}\s]/g;
        let basicMatch;

        while (
          (basicMatch = basicIdRegex.exec(html)) !== null &&
          videoIds.size < limit
        ) {
          // Extract the 11 char ID from the match
          const potentialId = basicMatch[0].substring(1, 12);
          if (potentialId.match(/^[a-zA-Z0-9_-]{11}$/)) {
            videoIds.add(potentialId);
            console.log(
              "Found potential videoId with basic pattern:",
              potentialId
            );
          }
        }
      }

      // Use the videoIds to create basic track objects
      const queryParts = query.split(" ");
      const artist = queryParts[0] || "Unknown Artist";
      const album = queryParts.length > 1 ? queryParts[1] : "Unknown Album";

      Array.from(videoIds).forEach((videoId, index) => {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const preview_url = `https://music.youtube.com/watch?v=${videoId}`;

        tracks.push({
          title: `Track ${index + 1} - ${album}`,
          videoId: videoId as string,
          url,
          preview_url,
          duration: "0:30",
          artist,
          album,
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        });
      });
    }

    return tracks;
  } catch (error) {
    console.error("Error searching for tracks:", error);
    return [];
  }
}
