import { useEffect, useState } from "react";
import { getHomeContent } from "../../services/api/customerHomeService";
import { getCategories } from "../../services/api/customerProductService";
import { useLocation } from "../../hooks/useLocation";
import CategoryTileSection from "./components/CategoryTileSection";
import ProductCard from "./components/ProductCard";

export default function Categories() {
  const { location } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<any>({
    homeSections: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getHomeContent(
          undefined,
          location?.latitude,
          location?.longitude
        );

        let sections: any[] = [];
        if (response.success && response.data) {
          sections = response.data.homeSections || [];
        }

        // Fallback 1: if admin homeSections are empty, render customer categories from /customer/home payload.
        if (sections.length === 0 && response.success && Array.isArray(response.data?.categories)) {
          const categories = response.data.categories
            .filter((c: any) => c && (c._id || c.id) && c.name)
            .map((c: any) => ({
              id: c._id || c.id,
              name: c.name,
              image: c.image,
              categoryId: c._id || c.id,
              slug: c.slug,
              type: "category",
            }));
          if (categories.length > 0) {
            sections = [
              {
                id: "categories-fallback-home",
                title: "Categories",
                displayType: "category",
                columns: 4,
                data: categories,
              },
            ];
          }
        }

        // Fallback 2: if still empty, fetch categories API directly.
        if (sections.length === 0) {
          try {
            const categoryRes = await getCategories(false);
            if (categoryRes.success && Array.isArray(categoryRes.data)) {
              const categories = categoryRes.data
                .filter((c: any) => c && (c._id || c.id) && c.name)
                .map((c: any) => ({
                  id: c._id || c.id,
                  name: c.name,
                  image: c.image,
                  categoryId: c._id || c.id,
                  slug: (c as any).slug,
                  type: "category",
                }));
              if (categories.length > 0) {
                sections = [
                  {
                    id: "categories-fallback-api",
                    title: "Categories",
                    displayType: "category",
                    columns: 4,
                    data: categories,
                  },
                ];
              }
            }
          } catch (e) {
            console.warn("Categories fallback API failed", e);
          }
        }

        // Inject Seller Categories. Customers must only see Active
        // seller-own categories; Inactive ones are hidden so the seller can
        // soft-disable them without removing the document. Missing `status`
        // is treated as Active for back-compat with older cached payloads.
        const sellerCatsStorage = localStorage.getItem('seller_own_categories');
        if (sellerCatsStorage) {
            try {
                const sellerCats = JSON.parse(sellerCatsStorage);
                const activeSellerCats = (sellerCats as any[]).filter(
                    (c) => c && (c.status === undefined || c.status === 'Active')
                );
                if (activeSellerCats.length > 0) {
                    const sellerSection = {
                        id: 'seller-categories-section',
                        title: 'Seller Categories',
                        type: 'category', // or whatever type matches CategoryTileSection
                        displayType: 'category', // Ensure this matches rendering logic
                        columns: 4,
                        data: activeSellerCats.map((c: any) => ({
                            id: c._id,
                            name: c.name,
                            image: c.image,
                            categoryId: c._id, // Add this so routing works
                            type: 'category',
                            productImages: [c.image], // Fallback for some views
                            itemCount: c.totalSubcategory || 0
                        }))
                    };
                    sections = [...sections, sellerSection];
                }
            } catch (e) {
                console.error("Error parsing seller categories", e);
            }
        }

        if (response.success || sections.length > 0) { // Allow if only seller cats exist too
          setHomeData({ ...(response.data || {}), homeSections: sections });
        } else {
          setError("Failed to load categories. Please try again.");
        }
      } catch (error) {
        console.error("Failed to fetch home content:", error);
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location?.latitude, location?.longitude]);

  if (loading && !homeData.homeSections.length) {
    return null; // Let global IconLoader handle it
  }

  if (error && !homeData.homeSections.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center bg-white">
        <div className="w-20 h-20 bg-[var(--customer-primary-alpha-10)] rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-[var(--customer-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6 max-w-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[var(--customer-primary-dark)] text-white rounded-full font-medium hover:bg-[var(--customer-primary-darker)] transition-colors"
        >
          Try Refreshing
        </button>
      </div>
    );
  }


  return (
    <div className="pb-4 md:pb-8 bg-white min-h-screen">
      {/* Page Header */}
      <div className="px-4 py-4 md:px-6 md:py-6 bg-white border-b border-neutral-200 fixed top-0 left-0 right-0 z-20 shadow-sm md:sticky md:top-0">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-900">Categories</h1>
      </div>
      {/* Spacer for fixed header on mobile */}
      <div className="h-[61px] md:hidden"></div>

      {/* Desktop view: original layout */}
      <div className="hidden md:block bg-neutral-50 pt-1 space-y-5 md:space-y-8 md:pt-4">
        {homeData.homeSections && homeData.homeSections.length > 0 ? (
          <>
            {homeData.homeSections.map((section: any) => {
              const columnCount = Number(section.columns) || 4;

              if (section.displayType === "products" && section.data && section.data.length > 0) {
                // Products display - same as home page
                const gridClass = {
                  2: "grid-cols-2",
                  3: "grid-cols-2 md:grid-cols-3",
                  4: "grid-cols-2 md:grid-cols-4",
                  6: "grid-cols-2 md:grid-cols-6",
                  8: "grid-cols-2 md:grid-cols-8"
                }[columnCount] || "grid-cols-2 md:grid-cols-4";

                const isCompact = columnCount >= 4;
                const gapClass = columnCount >= 4 ? "gap-2" : "gap-3 md:gap-4";

                return (
                  <div key={section.id} className="mt-6 mb-6 md:mt-8 md:mb-8">
                    {section.title && (
                      <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6 px-4 md:px-6 lg:px-8 tracking-tight capitalize">
                        {section.title}
                      </h2>
                    )}
                    <div className="px-4 md:px-6 lg:px-8">
                      <div className={`grid ${gridClass} ${gapClass}`}>
                        {section.data.map((product: any) => (
                          <ProductCard
                            key={product.id || product._id}
                            product={product}
                            categoryStyle={true}
                            showBadge={true}
                            showPackBadge={false}
                            showStockInfo={false}
                            compact={isCompact}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Categories/Subcategories display - same as home page
              return (
                <CategoryTileSection
                  key={section.id}
                  title={section.title}
                  tiles={section.data || []}
                  columns={columnCount as 2 | 3 | 4 | 6 | 8}
                  showProductCount={false}
                />
              );
            })}
          </>
        ) : (
          <div className="text-center py-12 md:py-16 text-neutral-500 px-4">
            <p className="text-lg md:text-xl mb-2">No categories found</p>
            <p className="text-sm md:text-base">
              Please create home sections from the admin panel
            </p>
          </div>
        )}
      </div>

      {/* Mobile view: beautiful custom circular layout matching user mockup exactly */}
      <div className="block md:hidden bg-white px-4 pt-4 space-y-6">
        {homeData.homeSections && homeData.homeSections.length > 0 ? (
          homeData.homeSections.map((section: any) => {
            if (section.data && section.data.length > 0) {
              // We render categories/subcategories/products section styled as mockup
              return (
                <div key={section.id} className="space-y-4">
                  {section.title && (
                    <h2 className="text-xl font-bold text-neutral-900" style={{ fontFamily: "Inter, sans-serif" }}>
                      {section.title}
                    </h2>
                  )}
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                    {section.data.map((tile: any, idx: number) => {
                      // High quality fallback icons or images
                      const slug = (tile.slug || tile.id || tile.name || "").toLowerCase();
                      let fallbackImage = "/dairy.jpg";
                      if (slug.includes("women") || slug.includes("lady") || slug.includes("ladies") || slug.includes("female")) fallbackImage = "/women.jpg";
                      else if (slug.includes("shirt") || slug.includes("cloth") || slug.includes("fashion") || slug.includes("men")) fallbackImage = "/shirt1.jpg";
                      else if (slug.includes("cold") || slug.includes("bev") || slug.includes("drink") || slug.includes("winter") || slug.includes("juice") || slug.includes("water") || slug.includes("coffee") || slug.includes("tea")) fallbackImage = "/cold.jpg";
                      else if (slug.includes("dairy") || slug.includes("grocer") || slug.includes("food") || slug.includes("milk") || slug.includes("egg") || slug.includes("rice") || slug.includes("atta") || slug.includes("dal") || slug.includes("besan") || slug.includes("sooji") || slug.includes("poha") || slug.includes("rajma") || slug.includes("moong") || slug.includes("millet")) fallbackImage = "/dairy.jpg";
                      else if (slug.includes("person") || slug.includes("beaut") || slug.includes("hygiene") || slug.includes("care")) fallbackImage = "/personal.jpg";
                      else if (slug.includes("bucket") || slug.includes("home") || slug.includes("clean") || slug.includes("house")) fallbackImage = "/bucket.jpg";
                      else if (slug.includes("electron") || slug.includes("gadget") || slug.includes("tech")) fallbackImage = "/electronics.jpg";
                      
                      // Curated list of soft subtle pastel border/background tints for circles as in the image
                      const pastels = ["#F2FCE4", "#FFF3EB", "#ECFFEC", "#FEEFEA", "#FFF8EB", "#F5F5FF", "#F8F0FF"];
                      const bgCircle = pastels[idx % pastels.length];

                      const imgUrl = tile.image || (tile.productImages && tile.productImages[0]) || fallbackImage;

                      // Link click navigation helper
                      const itemLink = tile.subcategoryId || tile.type === "subcategory"
                        ? tile.categoryId
                          ? `/category/${tile.categoryId}?subcategory=${tile.subcategoryId || tile.id}`
                          : tile.slug
                            ? `/category/${tile.slug}`
                            : `/category/subcategory/${tile.subcategoryId || tile.id}`
                        : tile.productId
                          ? `/product/${tile.productId}`
                          : tile.type === "category"
                            ? tile.slug
                              ? `/category/${tile.slug}`
                              : tile.categoryId
                                ? `/category/${tile.categoryId}`
                                : "#"
                            : tile.categoryId
                              ? `/category/${tile.categoryId}`
                              : (tile as any).sellerId
                                ? `/seller/${(tile as any).sellerId}`
                                : "#";

                      return (
                        <a
                          key={tile.id || idx}
                          href={itemLink}
                          className="flex flex-col items-center text-center space-y-1.5 focus:outline-none"
                        >
                          {/* Inner Round Circle Container */}
                          <div 
                            className="w-[86px] h-[86px] rounded-full flex items-center justify-center overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-neutral-100/50"
                            style={{ backgroundColor: bgCircle }}
                          >
                            <img
                              src={imgUrl}
                              alt={tile.name}
                              className="w-[82%] h-[82%] object-contain rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = fallbackImage;
                              }}
                            />
                          </div>
                          {/* Label Underneath */}
                          <span 
                            className="text-[10px] font-bold text-neutral-800 leading-tight w-full line-clamp-3 px-0.5"
                            style={{ fontFamily: "sans-serif" }}
                          >
                            {tile.name ? tile.name.charAt(0).toUpperCase() + tile.name.slice(1).toLowerCase() : ""}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="text-center py-12 text-neutral-500">
            <p className="text-lg mb-2">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}

