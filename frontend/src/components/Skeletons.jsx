import React from "react";
import { motion } from "framer-motion";

const CardSkeleton = () => (
  <div className="glass-card rounded-[2rem] overflow-hidden shadow-sm">
    <div className="shimmer aspect-[4/5] w-full" />
    <div className="p-5 space-y-3">
      <div className="shimmer h-4 w-2/3 rounded-md" />
      <div className="shimmer h-3 w-1/3 rounded-md" />
      <div className="flex justify-between items-center pt-3">
        <div className="shimmer h-6 w-16 rounded-md" />
        <div className="shimmer h-10 w-10 rounded-xl" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </motion.div>
);

export const HeroSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative rounded-[3rem] glass-card p-10 md:p-16 shadow-xl overflow-hidden"
  >
    <div className="shimmer h-12 w-2/3 rounded-xl mb-6" />
    <div className="shimmer h-4 w-1/2 rounded-md mb-3" />
    <div className="shimmer h-4 w-1/3 rounded-md mb-10" />
    <div className="shimmer h-14 w-full max-w-md rounded-2xl" />
  </motion.div>
);