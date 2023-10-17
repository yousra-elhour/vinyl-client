"use client";

import { ToasterProvider } from "@/providers/toast-provider";
import { AnimatePresence, motion } from "framer-motion";

export default function Client({ children }: { children: React.ReactNode }) {
  return (
    <>
      {" "}
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
    </>
  );
}
