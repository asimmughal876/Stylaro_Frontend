import React from "react";
import { motion } from "framer-motion";
const About = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className=" py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-600">About Us</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover who we are, what we stand for, and how we strive to serve you better every day.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 bg-white p-4 rounded-2xl overflow-hidden shadow-lg">
         <img
  src="https://img.freepik.com/free-photo/group-people-working-out-business-plan-office_1303-15864.jpg"
  alt="Our mission"
  className="w-full h-[300px] rounded-2xl shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
/>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide our customers with top-quality products, exceptional customer service, and a seamless online shopping experience.
              We believe in innovation, trust, and satisfaction — creating a space where everyone feels valued and inspired.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a future where technology meets creativity, helping people discover products that truly enhance their lifestyles.
              From fashion to function, we aim to be a brand that grows with you.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our vision"
            className="w-full h-[300px] rounded-2xl shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
          />
        </div>

      </div>
    </motion.div>
  );
};

export default About;
