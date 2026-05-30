import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Explicitly disable Next.js caching

export async function GET() {
  try {
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const song = await response.json();

    if (song.item === null) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return NextResponse.json(
      {
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
      },
      {
        status: 200,
        headers: {
          // Force fresh data at all times
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", 
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { isPlaying: false, message: "Error fetching Spotify data" },
      { status: 500 }
    );
  }
}
