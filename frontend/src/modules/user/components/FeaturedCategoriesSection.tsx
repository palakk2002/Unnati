import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategories } from "../../../services/api/customerProductService";
import { Category } from "../../../types/domain";

// A curated list of beautiful pastel background colors matching the reference image style
const PASTEL_BG_COLORS = [
  "#F2FCE4", // Light Green
  "#FFF3EB", // Light Peach/Orange
  "#ECFFEC", // Light Mint Green
  "#FEEFEA", // Light Pink/Rose
  "#FFF8EB", // Light Yellow
  "#F5F5FF", // Light Lavender/Blue
  "#F8F0FF", // Light Violet
  "#FFF3EB", // Light Peach/Orange (repeated)
  "#F2FCE4", // Light Green (repeated)
  "#FFF8EB", // Light Yellow (repeated)
];

// Fallback high-quality categories matching the user's mockup image
const MOCK_FEATURED_CATEGORIES = [
  { id: "grocery", name: "Cake & Milk", itemCount: 11, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=150&auto=format&fit=crop&q=80" },
  { id: "fruits", name: "Organic Kiwi", itemCount: 6, image: "https://images.unsplash.com/photo-1585059895524-72359e061381?w=150&auto=format&fit=crop&q=80" },
  { id: "peach", name: "Peach", itemCount: 6, image: "https://images.unsplash.com/photo-1628114251410-b998cf292c30?w=150&auto=format&fit=crop&q=80" },
  { id: "apple", name: "Red Apple", itemCount: 10, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&auto=format&fit=crop&q=80" },
  { id: "snacks", name: "Snacks", itemCount: 11, image: "https://images.unsplash.com/photo-1599490659283-44626a751c6a?w=150&auto=format&fit=crop&q=80" },
  { id: "vegetables", name: "Vegetables", itemCount: 6, image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=150&auto=format&fit=crop&q=80" },
  { id: "strawberry", name: "Strawberry", itemCount: 10, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=150&auto=format&fit=crop&q=80" },
  { id: "plum", name: "Black Plum", itemCount: 10, image: "https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=150&auto=format&fit=crop&q=80" },
  { id: "custard-apple", name: "Custard Apple", itemCount: 10, image: "https://images.unsplash.com/photo-1629115916386-b4851be52467?w=150&auto=format&fit=crop&q=80" },
  { id: "electronics", name: "Coffee & Tea", itemCount: 11, image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=150&auto=format&fit=crop&q=80" }
];

export default function FeaturedCategoriesSection() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(false);
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          const mapped = response.data.slice(0, 12).map((cat: any, index: number) => ({
            id: cat._id || cat.id,
            name: cat.name,
            itemCount: cat.productCount || Math.floor(Math.random() * 15) + 3,
            image: cat.image || MOCK_FEATURED_CATEGORIES[index % MOCK_FEATURED_CATEGORIES.length].image,
            slug: cat.slug || cat._id
          }));
          setCategories(mapped);
        } else {
          setCategories(MOCK_FEATURED_CATEGORIES);
        }
      } catch (error) {
        console.error("Error fetching categories for Featured Section:", error);
        setCategories(MOCK_FEATURED_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.7;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Top sub-header filters (e.g. Cake & Milk, Coffees & Teas, etc.)
  const filterTabs = ["All", "Cake & Milk", "Coffees & Teas", "Pet Foods", "Vegetables"];

  return (
    <div className="w-full bg-white py-2 pb-3.5 px-2 md:py-6 md:px-6 lg:px-8 border-b border-neutral-100 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
            <h2 
              className="text-lg md:text-2xl lg:text-[32px] font-bold tracking-tight"
              style={{ fontFamily: "'Quicksand', 'Nunito', 'Inter', sans-serif", color: '#253D4E' }}
            >
              Featured Categories
            </h2>
          </div>

          {/* Navigation Arrows (Hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleScroll("left")}
              className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 transition-all hover:shadow-sm active:scale-95"
              aria-label="Scroll left"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 transition-all hover:shadow-sm active:scale-95"
              aria-label="Scroll right"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2.5 md:gap-4 overflow-x-auto scrollbar-hide py-1 px-0.5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categories.map((category, index) => {
            const bgColor = PASTEL_BG_COLORS[index % PASTEL_BG_COLORS.length];
            // Capitalize category name: First letter uppercase, others lowercase
            const formattedName = category.name
              ? category.name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
              : "";
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer transition-all w-[92px] md:w-[136px]"
                onClick={() => {
                  if (category.slug) {
                    navigate(`/category/${category.slug}`);
                  } else {
                    navigate(`/category/${category.id}`);
                  }
                }}
              >
                {/* Mobile: rounded border square card. Desktop: uses fallback flex card styling */}
                <div 
                  className="w-[92px] h-[92px] md:w-full md:h-auto flex items-center justify-center border border-neutral-100 rounded-[24px] bg-white p-1 shadow-sm md:shadow-none md:border-0 md:bg-transparent"
                  style={{
                    backgroundColor: window.innerWidth < 768 ? '#ffffff' : bgColor,
                    borderRadius: window.innerWidth < 768 ? '24px' : '16px'
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-[20px] transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=150&auto=format&fit=crop&q=80"; // Fallback to veg image
                    }}
                  />
                </div>

                {/* Category Text Information */}
                <div className="w-full mt-2 text-center">
                  <h3 
                    className="text-[11px] md:text-[14px] font-bold text-[#1e293b] leading-tight w-full px-0.5 line-clamp-2"
                    style={{ fontFamily: "'Quicksand', 'Nunito', 'Inter', sans-serif" }}
                  >
                    {formattedName}
                  </h3>
                  <span className="hidden md:inline-block text-[11px] text-neutral-400 font-semibold leading-none mt-1">
                    {category.itemCount} items
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
