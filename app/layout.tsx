import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: { default: "DriverHub", template: "%s · DriverHub" }, description: "Your cars, membership, and road ahead." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
