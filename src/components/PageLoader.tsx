"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure the page is loaded
    const handleLoad = () => {
      // Add a small delay to ensure smoothness
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    // Check if the page is already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.5,
              ease: [0.2, 0, 0, 1] // Material Design 3 Emphasized easing
            } 
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.2, 0, 0, 1]
                }
              }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="relative w-24 h-24 mb-6"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <img
                src="https://i.postimg.cc/gwCGsMmL/icon-pwb.png"
                alt="Logo"
                className="relative w-full h-full rounded-full object-cover border-2 border-primary/20"
              />
            </motion.div>

            {/* Text */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.6,
                  ease: [0.2, 0, 0, 1]
                }
              }}
              className="text-2xl font-heading font-bold text-white tracking-widest"
            >
              FREECSS
            </motion.h1>

            {/* Loading Indicator - MD3 Progress Linear style */}
            <motion.div 
              className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ x: "-100%" }}
                animate={{ 
                  x: "100%",
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
