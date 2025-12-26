import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../model/Model";
import { showErrorToast } from "../utlis/toast";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {

  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate("");
  const handleAddToCart = () => {
    const user = getUserFromToken();
    if(user){
    dispatch(addToCart({ ...product, stock: product.quantity }))
    navigate("/cartPage")
    }
else{
  showErrorToast("Login Required For Add To Cart")
  return;
}
  };

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price;

  return (
    <motion.div
      className="min-w-[150px] w-full max-w-60 mx-auto bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-[300px] sm:h-[350px] overflow-hidden">

        <motion.img
          className="w-full h-full object-fill"
          src={product.image}
          alt={product.name}
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="bg-white text-black px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={16} /> Add to Cart
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <Heart
            size={20}
            className="transition-colors"
            stroke="currentColor"
            strokeWidth={2}
            fill={isFavorite ? "currentColor" : "none"}
            color={isFavorite ? "#ef4444" : "#6b7280"}
          />
        </motion.button>

        {hasDiscount && (
          <motion.div
            className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            -{product.discount}%
          </motion.div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          <div className="flex items-center">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1 text-gray-600">{product.rating || 'Not Rated'}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-gray-900">$: {discountedPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">$: {product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
