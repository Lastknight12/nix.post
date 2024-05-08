"use client"
import { motion, useScroll } from "framer-motion";
import React from "react";

const ScrollAnimation: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return <motion.div style={{ scaleX: scrollYProgress }} className="fixed h-1 bg-gradient-to-r from-blue-500 to-[#22c59a] top-0 origin-[0%] w-full shadow-[0_1px_20px_0_rgb(0_255_250)]"/>;
};

export default ScrollAnimation;
