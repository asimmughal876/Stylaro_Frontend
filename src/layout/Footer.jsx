import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative mt-20 bg-transparent"
    >
      {/* Skewed layered backgrounds */}
      <div className="absolute inset-0 -skew-y-6 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 shadow-xl opacity-90" />
      <div className="absolute inset-0 -skew-y-6 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-sm" />

      {/* Decorative blurred orb */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-400 opacity-20 rounded-full blur-[80px] pointer-events-none" />

      {/* Footer Content */}
      <div className="relative z-10 px-6 py-12 text-center text-white">
        <motion.h1
          className="text-3xl font-bold tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Thank You for Using Our Service!
        </motion.h1>
        <motion.p
          className="mt-3 text-sm text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;
