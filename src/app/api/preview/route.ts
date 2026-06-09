import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json()) as {
    image?: string;
    engravingText?: string;
    font?: string;
    color?: string;
    placement?: string;
    productName?: string;
  };

  const text = body.engravingText || "Your name";
  const image =
    body.image ||
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80";
  const previewRequest = {
    image,
    text,
    font: body.font || "Serif",
    color: body.color || "Champagne Gold",
    placement: body.placement || "the most natural personalization area",
    productName: body.productName || "custom product"
  };
  const provider = resolvePreviewProvider();
  console.info("[AI preview] request", {
    provider,
    hasHuggingFaceToken: Boolean(getHuggingFaceToken()),
    hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY),
    huggingFaceProvider: process.env.HUGGINGFACE_PROVIDER || "fal-ai",
    huggingFaceModel: process.env.HUGGINGFACE_MODEL || "fal-ai/flux-kontext/dev"
  });

  if (provider === "openai") {
    try {
      if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing.");
      const previewUrl = await generateOpenAiPreview(previewRequest);
      return NextResponse.json({ previewUrl, provider: "openai" });
    } catch (error) {
      return previewFailure(error, image, text, body.font, body.color);
    }
  }

  if (provider === "huggingface") {
    try {
      const token = getHuggingFaceToken();
      if (!token) throw new Error("HUGGINGFACE_API_KEY or HF_TOKEN is missing.");
      const previewUrl = await generateHuggingFacePreview(previewRequest, token);
      return NextResponse.json({ previewUrl, provider: "huggingface" });
    } catch (error) {
      return previewFailure(error, image, text, body.font, body.color);
    }
  }

  return NextResponse.json({ previewUrl: generateMockPreview({ image, text, font: body.font, color: body.color }), provider: "mock" });
}

function resolvePreviewProvider() {
  const configured = (process.env.AI_PREVIEW_PROVIDER || "").trim().toLowerCase();
  const hasHuggingFace = Boolean(getHuggingFaceToken());
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
  const fallbackToMock = process.env.AI_PREVIEW_FALLBACK_TO_MOCK === "true";

  if (configured === "mock" && hasHuggingFace && !fallbackToMock) return "huggingface";
  if (configured) return configured;
  if (hasHuggingFace) return "huggingface";
  if (hasOpenAi) return "openai";
  return "mock";
}

function getHuggingFaceToken() {
  return process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
}

async function generateOpenAiPreview({
  image,
  text,
  font,
  color,
  placement,
  productName
}: {
  image: string;
  text: string;
  font: string;
  color: string;
  placement: string;
  productName: string;
}) {
  const imageResponse = await fetch(image);
  if (!imageResponse.ok) {
    throw new Error(`Could not download product image: ${imageResponse.status}`);
  }

  const sourceBlob = await imageResponse.blob();
  const contentType = normalizeImageType(sourceBlob.type);
  const fileName = contentType === "image/png" ? "product.png" : contentType === "image/webp" ? "product.webp" : "product.jpg";
  const form = new FormData();

  form.append("model", process.env.OPENAI_IMAGE_MODEL || "gpt-image-1");
  form.append(
    "prompt",
    [
      `Edit this ${productName} product image for a realistic ecommerce preview.`,
      `Add the exact personalization text: "${sanitizePromptText(text)}".`,
      `Place it on ${placement}.`,
      `Use a ${font} style and ${color} color if it fits the product.`,
      "Preserve the original product, background, lighting, material, camera angle, and all existing details.",
      "Do not add extra words, logos, watermarks, mockup labels, hands, packaging, or decorative text.",
      "The output should look like the customer's final personalized product preview."
    ].join(" ")
  );
  form.append("image", new Blob([await sourceBlob.arrayBuffer()], { type: contentType }), fileName);
  form.append("n", "1");
  form.append("size", "1024x1024");
  form.append("quality", process.env.OPENAI_IMAGE_QUALITY || "low");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: form
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const result = data.data?.[0];
  if (result?.b64_json) return `data:image/png;base64,${result.b64_json}`;
  if (result?.url) return result.url;

  throw new Error("OpenAI image response did not include an image.");
}

async function generateHuggingFacePreview(
  {
    image,
    text,
    font,
    color,
    placement,
    productName
  }: {
    image: string;
    text: string;
    font: string;
    color: string;
    placement: string;
    productName: string;
  },
  token: string
) {
  const model = process.env.HUGGINGFACE_MODEL || "fal-ai/flux-kontext/dev";
  const huggingFaceProvider = process.env.HUGGINGFACE_PROVIDER || "fal-ai";
  const endpoint =
    process.env.HUGGINGFACE_ENDPOINT ||
    `https://router.huggingface.co/${encodeURIComponent(huggingFaceProvider)}/${model.split("/").map(encodeURIComponent).join("/")}`;
  const prompt = [
    "Use the input image as the strict source image.",
    `Only edit the visible product by adding this exact personalization text: "${sanitizePromptText(text)}".`,
    `Place the text on ${placement}.`,
    `Use a ${font} lettering style and ${color} color if it matches the product material.`,
    "Preserve the same product type, shape, material, color, background, lighting, camera angle, crop, and composition.",
    `The final image must still look like the same ${productName} from the input image.`,
    "Do not redesign the product, do not create a different product, do not invent a new necklace, bracelet, bag, pendant, or scene.",
    "Do not add any extra text, watermark, logo, labels, hands, packaging, or decorative elements."
  ].join(" ");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, image/png"
    },
    body: JSON.stringify(
      huggingFaceProvider === "fal-ai"
        ? {
            prompt,
            image_url: image,
            guidance_scale: Number(process.env.HUGGINGFACE_GUIDANCE_SCALE || 3.5),
            num_inference_steps: Number(process.env.HUGGINGFACE_STEPS || 28)
          }
        : {
            inputs: image,
            parameters: {
              prompt,
              negative_prompt: "watermark, logo, extra text, misspelled text, blurry, distorted product, low quality",
              guidance_scale: Number(process.env.HUGGINGFACE_GUIDANCE_SCALE || 3.5),
              num_inference_steps: Number(process.env.HUGGINGFACE_STEPS || 28),
              target_size: { width: 1024, height: 1024 }
            },
            options: {
              wait_for_model: true
            }
          }
    )
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (contentType.startsWith("image/")) {
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${bytes.toString("base64")}`;
  }

  const data = (await response.json()) as {
    image?: string;
    generated_image?: string;
    images?: Array<{ url?: string; content_type?: string } | string>;
    error?: string;
  };
  const firstImage = data.images?.[0];
  if (typeof firstImage === "string") return firstImage;
  if (firstImage?.url) return firstImage.url;
  const base64Image = data.image || data.generated_image;
  if (base64Image) return base64Image.startsWith("data:") ? base64Image : `data:image/png;base64,${base64Image}`;
  throw new Error(data.error || "Hugging Face response did not include an image.");
}

function previewFailure(error: unknown, image: string, text: string, font?: string, color?: string) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[AI preview] generation failed.", message);

  if (process.env.AI_PREVIEW_FALLBACK_TO_MOCK === "true") {
    return NextResponse.json({
      previewUrl: generateMockPreview({ image, text, font, color }),
      provider: "mock",
      warning: message
    });
  }

  return NextResponse.json({ error: message }, { status: 502 });
}

function generateMockPreview({ image, text, font, color }: { image: string; text: string; font?: string; color?: string }) {
  const fontFamily = font === "Script" ? "Georgia" : font === "Modern" ? "Arial" : "Times New Roman";
  const textColor = color === "Soft Black" ? "#161412" : color === "Ivory" ? "#fff8ec" : "#d8bd7f";
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
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function normalizeImageType(type: string) {
  if (type === "image/png" || type === "image/webp" || type === "image/jpeg") return type;
  return "image/jpeg";
}

function sanitizePromptText(value: string) {
  return value.replaceAll("\n", " ").replaceAll('"', "'").slice(0, 80);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
