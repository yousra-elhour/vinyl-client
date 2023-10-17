"use client";

import "./globals.css";
import type { Metadata } from "next";
import { ToasterProvider } from "@/providers/toast-provider";
import { AnimatePresence, motion } from "framer-motion";

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
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.25 }}
          >
            {" "}
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
