import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BANNERS_DATA = [
  {
    id: "banner-1",
    title: "Fresh Grocery",
    subtitle: "Daily essentials at best prices",
    priceText: "Only",
    price: "₹99",
    imageUrl: "/dairy.jpg", 
    bgColor: "#E4F0EB", // Soft brand green
    link: "/category/grocery",
  },
  {
    id: "banner-2",
    title: "Personal Care",
    subtitle: "Pamper yourself with top brands",
    priceText: "Only",
    price: "₹149",
    imageUrl: "/personal.jpg", 
    bgColor: "#FAF0D4", // Soft brand gold
    link: "/category/beauty",
  },
  {
    id: "banner-3",
    title: "Smart Devices",
    subtitle: "Upgrade to modern living",
    priceText: "Only",
    price: "₹299",
    imageUrl: "/electronics.jpg", 
    bgColor: "#E4F2EE", // Soft brand mint/teal
    link: "/category/electronics",
  }
];

export default function HomeThreePromoBanners() {
  return (
    <div className="px-2 md:px-4 lg:px-4 py-2 mt-2 mb-4">
      {/* Grid wrapper for three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {BANNERS_DATA.map((banner) => (
          <motion.div
            key={banner.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-[20px] p-6 relative overflow-hidden flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 min-h-[145px]"
            style={{ backgroundColor: banner.bgColor }}
          >
            {/* Left Column Information */}
            <div className="flex flex-col items-start text-left max-w-[55%] z-10 font-sans" style={{ fontFamily: "'Quicksand', 'Nunito', 'Inter', sans-serif" }}>
              
              {/* Titles */}
              <h3 className="text-[#253D4E] font-black text-sm md:text-lg leading-tight truncate w-full">
                {banner.title}
              </h3>
              <p className="text-[#253D4E] text-[11px] md:text-xs font-bold leading-normal mb-1 opacity-90 truncate w-full">
                {banner.subtitle}
              </p>

              {/* Price Details */}
              <div className="flex flex-col items-start mb-3">
                <span className="text-[#253D4E] text-[9px] md:text-[10px] font-semibold leading-none opacity-75">
                  {banner.priceText}
                </span>
                <span className="text-[#253D4E] text-base md:text-lg font-black leading-none mt-0.5">
                  {banner.price}
                </span>
              </div>

              {/* Shop Now Action Button */}
              <Link
                to={banner.link}
                className="bg-white hover:bg-[var(--customer-primary)] hover:text-white text-[#253D4E] font-black text-[9px] md:text-xs px-4 md:px-5 py-1.5 md:py-2 rounded-full transition-all shadow-sm active:scale-95"
              >
                Shop Now
              </Link>
            </div>

            {/* Right Column Product Graphic */}
            <div className="w-[40%] h-full relative flex items-center justify-end z-10">
              <div className="w-[85px] h-[85px] md:w-[105px] md:h-[105px] rounded-full overflow-hidden bg-white/20 flex items-center justify-center p-0.5 shadow-inner">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
