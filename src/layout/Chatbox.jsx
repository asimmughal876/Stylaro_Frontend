import React, { useEffect, useRef, useState } from "react";
import { SendHorizonal, MessageCircle, Mic, X, Star, ShoppingBag } from "lucide-react";
import { getUserFromToken, sendChatMessage } from "../model/Model";
import { addToCart } from "../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../utlis/toast";
import { useDispatch } from "react-redux";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [{ text: "Hi! I'm your assistant. Ask me about any product.", sender: "bot" }];
  });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const user = getUserFromToken();
    if (user) {
      const productData = {
        _id: product._id,
        name: product.Product,
        image: product.Image,
        price: parseInt(product.Price),
        quantity: product.Quantity,
        discount: product.Discount,
        rating: product.Rating
      };
      dispatch(addToCart({ ...productData, stock: product.Quantity }));
      navigate("/cartPage");
    } else {
      showErrorToast("Login Required For Add To Cart");
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMsg].slice(-20);
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(input, updatedMessages);
      const botMsg = { text: reply, sender: "bot" };
      setMessages(prev => [...prev, botMsg].slice(-20));
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = { text: "Sorry, I encountered an error. Please try again.", sender: "bot" };
      setMessages(prev => [...prev, errorMsg].slice(-20));
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showErrorToast("Speech recognition not supported in your browser");
      return;
    }

    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to session storage
  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " + speechText : speechText));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        showErrorToast("Microphone access denied. Please allow microphone access.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const parseProductData = (productBlock) => {
    const lines = productBlock.split("\n");
    const productData = {};
    lines.forEach(line => {
      const [key, ...rest] = line.split(": ");
      if (key) {
        const cleanKey = key.trim();
        productData[cleanKey] = rest.join(": ").trim();
      }
    });
    return productData;
  };

  const renderBotMessage = (msgText) => {
    const blocks = msgText.split("\n\n");
    const productBlocks = blocks.filter(b => b.includes("Product:"));
    const messageTextOnly = blocks
      .filter(b => !b.includes("Product:"))
      .join("\n\n");

    return (
      <>
        {messageTextOnly && (
          <div className="mb-2 whitespace-pre-line text-sm">
            {messageTextOnly}
          </div>
        )}

        {productBlocks.map((productBlock, idx) => {
          const productData = parseProductData(productBlock);
          
          return (
            <div
              key={idx}
              className="mb-2 p-2 border rounded bg-white shadow text-left text-xs font-medium text-gray-800"
            >
              <div>
                <strong>{productData["Product"]}</strong>
              </div>

              {productData["Image"]?.startsWith("http") && (
                <img
                  src={productData["Image"]}
                  alt={productData["Product"] || "Product Image"}
                  className="w-24 h-24 object-contain rounded my-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              <div>Price: ${productData["Price"]}</div>
              <div className="flex items-center"> 
                Rating: <Star size={9} className="fill-yellow-400 text-yellow-400 mx-1" />  
                {productData["Rating"]}
              </div>
              <div>Gender: {productData["Gender"]}</div>
              <div>Category: {productData["Category"]}</div>
              <div>Color: {productData["Color"]}</div>
              <div>Quantity: {productData["Quantity"]}</div>
              <div>Discount: %{productData["Discount"]}</div>
           {/* Add to Cart Button */}
    <div className="pt-2">
      <button
        onClick={() => handleAddToCart(productData)}
        className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition text-sm"
      >
        <ShoppingBag size={14} />
        Add to Cart
      </button>
    </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-lg flex flex-col">
          <div className="bg-green-600 text-white rounded-t-2xl px-4 py-2 flex justify-between items-center">
            <span>Assistant</span>
            <button onClick={toggleChat} className="text-white">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-green-100 ml-auto text-right"
                    : "bg-gray-200 mr-auto text-left"
                }`}
              >
                {msg.sender === "bot" ? renderBotMessage(msg.text) : msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <div className="text-xs text-gray-500 flex items-center">
                <div className="animate-pulse">Assistant is typing</div>
                <div className="ml-1 flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
          <div className="flex border-t px-2 py-2 items-center">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-9 h-9 flex items-center justify-center rounded-full mr-2 ${
                isListening ? "bg-red-100" : "bg-gray-100"
              }`}
              title={isListening ? "Stop listening" : "Click to speak"}
              disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
            >
              <Mic className={isListening ? "text-red-600" : "text-gray-600"} size={16} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 outline-none px-2 py-1 text-sm border rounded-l-lg h-9"
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="h-9 bg-green-500 text-white px-3 rounded-r-lg hover:bg-green-600 disabled:bg-green-300"
            >
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Open chat"
        >
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  );
};

export default Chatbox;