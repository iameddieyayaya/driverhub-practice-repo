import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  // TODO(PRACTICE): Use the Network and Timing panels to prove where these three seconds are spent.
  await new Promise((resolve) => setTimeout(resolve, 3_000));
  return NextResponse.json({ message: "The scenic route took longer than expected.", delayedMs: 3000 });
}
