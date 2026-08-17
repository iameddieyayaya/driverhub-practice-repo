import { NextResponse } from "next/server";

function response(): NextResponse {
  const res = NextResponse.json({ message: "CORS laboratory response" });
  const configuredOrigin = process.env.PRACTICE_CORS_ORIGIN;
  if (configuredOrigin) res.headers.set("Access-Control-Allow-Origin", configuredOrigin);
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  return res;
}

export function GET(): Response { return response(); }
export function OPTIONS(): Response { return response(); }
