import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const slides = [
  {
    img: "https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV",
    title: "Explore the Future",
    subtitle: "Discover innovation beyond limits.",
  },
  {
    img: "https://www.highsnobiety.com/static-assets/dato/1682635705-how-to-care-for-clothes-02.jpg",
    title: "Seamless Experience",
    subtitle: "Design meets performance perfectly.",
  },
  {
    img: "https://cdn.metro-online.com/-/media/Project/MCW/PK_Metro/2020-to-2021/Product-World-2021/04ApparelFootwear.jpg?h=464&iar=0&w=1392&rev=69858498252c43a4aec6e62f30c0aac9&hash=4F48084E977F81C37D1D04F7AF2D4F82",
    title: "Elevate Your World",
    subtitle: "Technology reimagined for you.",
  },
];

const ImageSlidShow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
      className="relative w-full max-w-[1200px] h-64 md:h-[400px] mx-auto overflow-hidden rounded-2xl shadow-lg mt-10"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out will-change-transform"
        style={{
          transform: `translateX(-${currentIndex * width}px)`,
          width: `${slides.length * width}px`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative h-64 md:h-[400px] flex-shrink-0"
            style={{ width: `${width}px` }}
          >
            <img
              src={slide.img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
              <p className="text-sm md:text-lg mt-2">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 text-black p-2 rounded-full hover:bg-white z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 text-black p-2 rounded-full hover:bg-white z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default ImageSlidShow;
