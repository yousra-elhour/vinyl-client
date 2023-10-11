import "./globals.css";
import type { Metadata } from "next";
import { ToasterProvider } from "@/providers/toast-provider";

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
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
