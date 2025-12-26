import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite, fetchFavorites } from "../redux/slice/favoriteSlice";
import ProductCard from "./ProductCard";

const ScrollSection = ({ title, products, gradient, skew }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const [isHovered, setIsHovered] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("right");
  const [translateX, setTranslateX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const cardWidth = isMobile ? 250 : 300;
  const totalWidth = products.length * cardWidth;

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    let animationFrameId;
    let lastTimestamp = performance.now();

    const animate = (timestamp) => {
      if (!contentRef.current || isHovered || isMobile) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      const containerWidth = containerRef.current?.offsetWidth || 0;
      const maxTranslate = Math.max(0, totalWidth - containerWidth);

      setTranslateX((prev) => {
        let next = prev + (scrollDirection === "right" ? -0.05 : 0.05) * delta;

        if (next <= -maxTranslate) {
          setScrollDirection("left");
          next = -maxTranslate;
        } else if (next >= 0) {
          setScrollDirection("right");
          next = 0;
        }

        return next;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, scrollDirection, totalWidth, isMobile]);

  const handleToggleFavorite = (productId) => {
    dispatch(toggleFavorite({ productId }));
  };

  // const manualScroll = (dir) => {
  //   const container = containerRef.current;
  //   if (!container) return;
  //   const scrollAmount = container.offsetWidth * 0.8;

  //   if (isMobile) {
  //     const newScroll =
  //       dir === "left"
  //         ? container.scrollLeft - scrollAmount
  //         : container.scrollLeft + scrollAmount;
  //     container.scrollTo({ left: newScroll, behavior: "smooth" });
  //   } else {
  //     const containerWidth = container.offsetWidth;
  //     const maxTranslate = Math.max(0, totalWidth - containerWidth);
  //     const amount = dir === "left" ? scrollAmount : -scrollAmount;

  //     setTranslateX((prev) => {
  //       let next = prev + amount;
  //       if (next > 0) next = 0;
  //       if (next < -maxTranslate) next = -maxTranslate;
  //       return next;
  //     });
  //   }
  // };

  return (
    <motion.div className="relative overflow-hidden">
      <div className={`absolute inset-0 z-0 ${gradient} transform ${skew} origin-top-left`} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-blue-300 to-purple-400 rounded-full mt-2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </motion.div>

        {/* <AnimatePresence>
          <motion.button
            onClick={() => manualScroll("left")}
            className="sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
        </AnimatePresence> */}

        <div
          ref={containerRef}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          className="overflow-x-auto"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <motion.div
            ref={contentRef}
            className="flex gap-6"
            animate={isMobile ? undefined : { x: translateX }}
            transition={{ type: "tween", ease: "linear", duration: 0.02 }}
            style={{ willChange: isMobile ? "auto" : "transform" }}
          >
            {products.map((product, i) => (
              <motion.div
                key={product._id || i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${isMobile ? "min-w-[200px]" : "min-w-[250px] sm:min-w-[280px]"
                  } max-w-[300px] snap-start`}
              >
                <ProductCard
                  product={product}
                  isFavorite={favoriteItems.includes(product._id)}
                  onToggleFavorite={() => handleToggleFavorite(product._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* <AnimatePresence>
          <motion.button
            onClick={() => manualScroll("right")}
            className="sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.button>
        </AnimatePresence> */}
      </div>
    </motion.div>
  );
};

export default ScrollSection;
