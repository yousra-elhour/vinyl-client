import { NextRequest, NextResponse } from "next/server";
import { YTMusicAlbum, YTMusicTrack } from "@/utils/youtubeMusic";

/**
 * YouTube Music Album API route
 * This searches for and scrapes album data from YouTube Music
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

    // First, search for the album
    const albumInfo = await searchYouTubeMusicAlbum(query);

    if (!albumInfo) {
      return NextResponse.json(
        { success: false, error: "Album not found" },
        { status: 404 }
      );
    }

    // Then get the album tracks
    const tracks = await getAlbumTracks(albumInfo.albumId);

    // Construct the full album object
    const album: YTMusicAlbum = {
      ...albumInfo,
      tracks,
    };

    return NextResponse.json({
      success: true,
      album,
    });
  } catch (error) {
    console.error("YouTube Music album error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch YouTube Music album" },
      { status: 500 }
    );
  }
}

/**
 * Searches for an album on YouTube Music
 */
async function searchYouTubeMusicAlbum(
  query: string
): Promise<Omit<YTMusicAlbum, "tracks"> | null> {
  try {
    // Use YouTube Music search URL with language and region parameters
    const searchUrl = `https://music.youtube.com/search?q=${encodeURIComponent(
      query
    )}&hl=en&gl=US`;

    console.log(`Searching YouTube Music for album with URL: ${searchUrl}`);

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

    // Log the first 1000 characters of the response to avoid console overload
    console.log(
      "YouTube Music HTML response (first 1000 chars):",
      html.substring(0, 1000)
    );
    console.log("YouTube Music HTML response length:", html.length);

    // Log key patterns to help with debugging
    console.log("HTML contains albumId:", html.includes("albumId"));
    console.log("HTML contains browseId:", html.includes("browseId"));
    console.log(
      "HTML contains musicAlbumShelfRenderer:",
      html.includes("musicAlbumShelfRenderer")
    );

    // Try multiple regex patterns to find album data

    // First pattern: Classic album pattern
    const albumDataRegex =
      /"albumId":"([^"]+)".*?"title":"([^"]+)".*?"artists":\[{"name":"([^"]+)".*?"thumbnails":\[\{"url":"([^"]+)".*?"year":"([^"]+)"/;
    let match = html.match(albumDataRegex);

    // Second pattern: Alternative format
    if (!match) {
      console.log("First album regex didn't match, trying alternative pattern");
      const altAlbumRegex =
        /"browseId":"([^"]+)".*?"text":"([^"]+)".*?"musicAlbumRelease.*?"text":"([^"]+)".*?"thumbnails":\[\{"url":"([^"]+)"/;
      match = html.match(altAlbumRegex);

      if (match) {
        // Format is different for this pattern
        const [, albumId, title, artist, thumbnailUrl] = match;

        // Try to extract year if available
        const yearRegex =
          /"musicAlbumRelease.*?"text":"[^"]+".*?"text":"([0-9]{4})"/;
        const yearMatch = html.match(yearRegex);
        const year = yearMatch ? yearMatch[1] : "Unknown";

        console.log(
          `Found album with alternative pattern: ${title} by ${artist}`
        );

        return {
          albumId,
          title,
          artist,
          thumbnailUrl,
          year,
        };
      }
    }

    // Third pattern: Even more simplified
    if (!match) {
      console.log("Second album regex didn't match, trying simplified pattern");
      const simpleAlbumRegex =
        /"browseId":"([^"]+)"[\s\S]*?album[\s\S]*?"text":"([^"]+)"/;
      match = html.match(simpleAlbumRegex);

      if (match) {
        // We found some kind of album, but with less info
        const [, albumId, title] = match;

        // Try to detect artist name if possible
        let artist = "Unknown Artist";
        const artistRegex = /"runs":\[\{"text":"([^"]+)"\},\{"text":" • "/;
        const artistMatch = html.match(artistRegex);
        if (artistMatch) {
          artist = artistMatch[1];
        }

        // Use a default thumbnail
        const thumbnailUrl = `https://music.youtube.com/img/album_${albumId}_default.jpg`;
        const year = "Unknown";

        console.log(`Found album with simplified pattern: ${title}`);

        return {
          albumId,
          title,
          artist,
          thumbnailUrl,
          year,
        };
      }
    }

    if (!match) {
      console.log(
        "No album found in YouTube Music search results - None of the regex patterns matched"
      );
      // Try one last desperate approach - just find any browseId
      const lastResortRegex = /"browseId":"([^"]+)"/;
      const lastMatch = html.match(lastResortRegex);

      if (lastMatch && query) {
        // Make a best guess based on the search query
        const [, albumId] = lastMatch;

        // Try to parse artist and album from query
        const parts = query.split(" ");
        const possibleArtist = parts[0] || "Unknown";
        const possibleTitle = parts.slice(1).join(" ") || "Unknown Album";

        console.log(
          `Last resort: Using browseId ${albumId} with title derived from query`
        );

        return {
          albumId,
          title: possibleTitle,
          artist: possibleArtist,
          thumbnailUrl: `https://music.youtube.com/img/album_default.jpg`,
          year: "Unknown",
        };
      }

      return null;
    }

    const [, albumId, title, artist, thumbnailUrl, year] = match;

    console.log(`Found album: ${title} by ${artist} (${year})`);

    return {
      albumId,
      title,
      artist,
      thumbnailUrl,
      year,
    };
  } catch (error) {
    console.error("Error searching for album:", error);
    return null;
  }
}

/**
 * Gets tracks from an album using its ID
 */
async function getAlbumTracks(albumId: string): Promise<YTMusicTrack[]> {
  try {
    // Fetch the album page to get track list
    const albumUrl = `https://music.youtube.com/browse/${albumId}?hl=en&gl=US`;

    const response = await fetch(albumUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch album page: ${response.status}`);
    }

    const html = await response.text();

    console.log("Album page HTML length:", html.length);
    console.log("Album page first 500 chars:", html.substring(0, 500));

    // Check if we have track data in the response
    console.log("Album HTML contains videoId:", html.includes("videoId"));
    console.log(
      "Album HTML contains musicResponsiveListItemRenderer:",
      html.includes("musicResponsiveListItemRenderer")
    );

    // Extract tracks using various regex patterns
    const tracks: YTMusicTrack[] = [];

    // Pattern 1: Classic pattern
    const tracksRegex =
      /"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"\}\].*?"lengthText":\{"runs":\[\{"text":"([^"]+)"\}\]/g;

    let match;

    // Get album title from the page
    const albumTitleMatch = html.match(/"title":"([^"]+)"/);
    const albumTitle = albumTitleMatch ? albumTitleMatch[1] : "Unknown Album";

    // Get artist from the page
    const artistMatch = html.match(/"artistDisplayName":"([^"]+)"/);
    const artist = artistMatch ? artistMatch[1] : "Unknown Artist";

    // Extract thumbnail
    const thumbnailMatch = html.match(/"thumbnails":\[\{"url":"([^"]+)"/);
    const thumbnail = thumbnailMatch ? thumbnailMatch[1] : "";

    // Extract all tracks with first pattern
    while ((match = tracksRegex.exec(html)) !== null) {
      const [, videoId, title, duration] = match;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const preview_url = `https://music.youtube.com/watch?v=${videoId}`;

      tracks.push({
        title,
        videoId,
        url,
        preview_url,
        duration,
        artist,
        album: albumTitle,
        thumbnailUrl: thumbnail,
      });
    }

    console.log(`Found ${tracks.length} tracks with classic pattern`);

    // If no tracks found with first pattern, try alternative pattern
    if (tracks.length === 0) {
      console.log(
        "No tracks found with classic pattern, trying alternative pattern"
      );

      // Pattern 2: Alternative track pattern
      const altTracksRegex = /"videoId":"([^"]+)"[\s\S]*?"text":"([^"]+)"/g;

      while ((match = altTracksRegex.exec(html)) !== null) {
        const [, videoId, title] = match;
        if (!videoId || !title) continue;

        // Check if this is actually a track (filter out menu items, etc)
        if (videoId.length < 8) continue;

        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const preview_url = `https://music.youtube.com/watch?v=${videoId}`;
        const duration = "0:30"; // Default duration

        tracks.push({
          title,
          videoId,
          url,
          preview_url,
          duration,
          artist,
          album: albumTitle,
          thumbnailUrl:
            thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        });
      }

      console.log(`Found ${tracks.length} tracks with alternative pattern`);
    }

    // If we still don't have tracks, try the last resort approach
    if (tracks.length === 0) {
      console.log("Still no tracks found, trying videoId extraction");

      // Just find all videoIds in the page
      const videoIdRegex = /"videoId":"([^"]+)"/g;
      const videoIds = new Set<string>();

      while ((match = videoIdRegex.exec(html)) !== null) {
        const videoId = match[1];
        if (videoId && videoId.length > 8) {
          // Filter out very short IDs
          videoIds.add(videoId);
        }
      }

      console.log(`Found ${videoIds.size} potential track videoIds`);

      // Create track objects from the videoIds
      let index = 1;
      videoIds.forEach((videoId) => {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const preview_url = `https://music.youtube.com/watch?v=${videoId}`;

        tracks.push({
          title: `Track ${index}`,
          videoId,
          url,
          preview_url,
          duration: "0:30",
          artist,
          album: albumTitle,
          thumbnailUrl:
            thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        });

        index++;
      });
    }

    return tracks;
  } catch (error) {
    console.error("Error fetching album tracks:", error);
    return [];
  }
}
