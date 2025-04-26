import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }

    console.log("Deezer API: Fetching tracks for query:", query);

    // Call Deezer search API
    const searchUrl = `https://api.deezer.com/search?q=${encodeURIComponent(
      query
    )}&limit=20`;
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch from Deezer API with status:",
        response.status
      );
      return NextResponse.json(
        { error: "Failed to fetch from Deezer API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Map Deezer tracks to a consistent format like we had with Spotify
    const tracks = (data.data || []).map((item: any) => ({
      title: item.title,
      artist: item.artist.name,
      preview_url: item.preview, // Deezer reliably provides preview URLs
      album: item.album.title,
      duration: item.duration,
      album_cover: item.album.cover_medium,
    }));

    console.log(`Found ${tracks.length} tracks from Deezer`);

    return NextResponse.json({ albumTracks: tracks });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
