import "./globals.css";
import type { Metadata } from "next";

import Client from "@/components/ui/Client";

export const metadata: Metadata = {
  title: "Vinyl Shop",
  description: "Vinyl Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Client>{children}</Client>
      </body>
    </html>
  );
}
