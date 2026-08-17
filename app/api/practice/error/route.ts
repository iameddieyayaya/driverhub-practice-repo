import { NextResponse } from "next/server";

export function GET(request: Request): Response {
  const enabled = new URL(request.url).searchParams.get("trigger") === "true";
  if (enabled) {
    // TODO(PRACTICE): Trace this controlled failure using the response request ID and server log.
    throw new Error("PRACTICE_CONTROLLED_FAILURE: simulated inventory dependency crash");
  }
  return NextResponse.json({ hint: "Add ?trigger=true when you are ready to investigate." });
}
