import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Standard list - reliable fallback
let gallery = [
  "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=800&auto=format&fit=crop"
];

export async function GET() {
  return NextResponse.json({ images: gallery });
}

export async function POST(request: Request) {
  const { url } = await request.json();
  if (url) gallery = [url, ...gallery];
  return NextResponse.json({ images: gallery });
}
