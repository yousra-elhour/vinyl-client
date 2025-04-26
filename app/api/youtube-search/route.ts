import { NextRequest, NextResponse } from "next/server";

/**
 * YouTube Search API
 * This endpoint searches YouTube and returns videos that are likely to be embeddable
 */
export async function GET(request: NextRequest) {
  try {
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Missing search query" },
        { status: 400 }
      );
    }

    console.log(`YouTube search API: Searching for "${query}"`);

    // Try to use YouTube Data API if key is available
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        const videos = await searchWithYouTubeAPI(query, apiKey);
        return NextResponse.json({
          success: true,
          videos,
        });
      } catch (apiError) {
        console.error("YouTube API error:", apiError);
        // Fall back to scraping if API fails
      }
    }

    // Fall back to scraping YouTube search results
    const videos = await scrapeYouTubeResults(query);

    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { success: false, error: "No videos found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search YouTube" },
      { status: 500 }
    );
  }
}

/**
 * Search YouTube using the Data API
 */
async function searchWithYouTubeAPI(query: string, apiKey: string) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
    query
  )}&type=video&videoEmbeddable=true&key=${apiKey}`;

  const response = await fetch(searchUrl);

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    channelTitle: item.snippet.channelTitle,
  }));
}

/**
 * Scrape YouTube search results as a fallback
 */
async function scrapeYouTubeResults(query: string) {
  try {
    // Add "lyrics" to the query to increase chances of finding embeddable videos
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query + " lyrics"
    )}`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube search: ${response.status}`);
    }

    const html = await response.text();

    // Extract video information from the search results page
    const videoRegex =
      /"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]/g;
    const thumbnailRegex =
      /"videoId":"([^"]+)".*?"thumbnail":\{"thumbnails":\[\{"url":"([^"]+)"/g;

    const videos = [];
    const processedIds = new Set();

    // Extract video IDs and titles
    let match;
    while ((match = videoRegex.exec(html)) !== null) {
      const [, id, title] = match;

      // Skip if we already processed this ID or if it's too short
      if (processedIds.has(id) || id.length < 11) continue;
      processedIds.add(id);

      // Only get the first 3 videos
      if (videos.length >= 3) break;

      videos.push({
        id,
        title,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        channelTitle: "YouTube",
      });
    }

    // If no videos found with the regex, use a simpler approach
    if (videos.length === 0) {
      const simpleRegex = /watch\?v=([a-zA-Z0-9_-]{11})/g;

      while ((match = simpleRegex.exec(html)) !== null) {
        const id = match[1];

        // Skip if we already processed this ID
        if (processedIds.has(id)) continue;
        processedIds.add(id);

        // Only get the first 3 videos
        if (videos.length >= 3) break;

        videos.push({
          id,
          title: `YouTube Video ${id}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          channelTitle: "YouTube",
        });
      }
    }

    return videos;
  } catch (error) {
    console.error("Error scraping YouTube:", error);
    return [];
  }
}
