/**
 * TypingIndicator Component
 *
 * Displays an animated indicator showing Claude is processing a response.
 * Uses Framer Motion for smooth dot animation.
 */

'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 text-gray-500">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
          aria-hidden="true"
        />
      ))}
      <span className="ml-2 text-sm">Claude is thinking...</span>
    </div>
  );
}
