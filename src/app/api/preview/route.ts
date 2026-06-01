import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    image?: string;
    engravingText?: string;
    font?: string;
    color?: string;
  };

  const text = body.engravingText || "Your name";
  const image =
    body.image ||
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80";
  const fontFamily = body.font === "Script" ? "Georgia" : body.font === "Modern" ? "Arial" : "Times New Roman";
  const textColor = body.color === "Soft Black" ? "#161412" : body.color === "Ivory" ? "#fff8ec" : "#d8bd7f";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
          <stop offset="100%" stop-color="rgba(22,20,18,0.42)" />
        </linearGradient>
      </defs>
      <image href="${image.replace(/&/g, "&amp;")}" width="900" height="1125" preserveAspectRatio="xMidYMid slice" />
      <rect width="900" height="1125" fill="url(#fade)" />
      <g transform="translate(450 655)">
        <rect x="-220" y="-54" width="440" height="108" rx="54" fill="rgba(255,255,255,0.72)" />
        <text text-anchor="middle" dominant-baseline="middle" font-family="${fontFamily}" font-size="56" font-weight="700" fill="${textColor}">
          ${escapeXml(text)}
        </text>
      </g>
    </svg>`;
  const previewUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return NextResponse.json({ previewUrl });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
