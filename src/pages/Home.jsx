import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchproducts } from "../redux/slice/productSlice";
import { motion } from "framer-motion";
import ImageSlidShow from "../component/ImageSlidShow";
import ScrollSection from "../component/ScrollSection";

const CategoryGrid = () => {
  const categories = [
    { name: "Men's Fashion", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80" },
    { name: "Women's Wear", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
    { name: "Electronics", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
    { name: "Home & Living", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80" },
  ];

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-gray-900 mb-8"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Shop by Category
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div 
            key={index} 
            className="relative group overflow-hidden rounded-xl shadow-md h-64"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <motion.img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-6">
              <motion.h3 
                className="text-xl font-semibold text-white"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {category.name}
              </motion.h3>
            </div>
            <a className="absolute inset-0" aria-label={`Shop ${category.name}`}></a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};


const Home = () => {
  const {
    product: products
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchproducts());
  }, [dispatch]);

  const getOneProductPerCategory = (products) => {
  const categoryMap = new Map();

  for (const product of products) {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, product);
    }
  }
  return Array.from(categoryMap.values());
};


const groupByCategory = (products) => {
  const grouped = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return Object.entries(grouped).filter(([_, items]) => items.length >= 5);
};


  const sectionStyles = [
  {
    gradient: "bg-gradient-to-r from-blue-900 to-gray-800",
    skew: "skew-y-[-3deg]",
  },
  {
    gradient: "bg-gradient-to-r from-purple-800 to-pink-700",
    skew: "skew-y-[3deg]",
  },
  {
    gradient: "bg-gradient-to-r from-blue-800 to-sky-400",
    skew: "skew-y-[-3deg]",
  },
  {
    gradient: "bg-gradient-to-r from-green-800 to-emerald-600",
    skew: "skew-y-[3deg]",
  },
];

  const groupedProducts = groupByCategory(products);
  const featuredProducts = getOneProductPerCategory(products);
  return (
    <div className="">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-10">
        <ImageSlidShow />
      </div>

      {/* Featured Products */}
      <ScrollSection 
        title="Latest Products" 
        key={featuredProducts}
        products={featuredProducts} 
        gradient={sectionStyles[1].gradient}
        skew={sectionStyles[1].skew}
      />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Category Sections */}
{groupedProducts.map(([category, items], index) => (
  <div className="mb-20"   key={category}>
  <ScrollSection
    key={category}
    title={category}
    products={items}
    gradient={sectionStyles[index % sectionStyles.length].gradient}
    skew={sectionStyles[index % sectionStyles.length].skew}
  />
  </div>
))}


    </div>
  );
};

export default Home;