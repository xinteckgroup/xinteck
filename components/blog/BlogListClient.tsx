"use client";

import { BlogGrid } from "@/components/sections/BlogGrid";
import { PublicPost } from "@/lib/public-data";
import { Search } from "lucide-react";
import { useState } from "react";

const ITEMS_PER_PAGE = 6;

export function BlogListClient({ allPosts }: { allPosts: PublicPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search query
  const filteredPosts = allPosts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tag?.toLowerCase().includes(query)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle Page Change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Search Section - Moved here to control state */}
      <section className="px-6 pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="text-sm md:text-base font-bold tracking-[0.2em] text-gold uppercase mb-2">
                Insights & Innovation
              </h1>
              <h2 className="text-2xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground uppercase">
                THE <span className="text-gold">X-LABS</span> BLOG.
              </h2>
              <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
                Deep dives into the technology we build, the challenges we overcome, 
                and the future we are engineering today.
              </p>
            </div>

            <div className="relative max-w-xl w-full mt-4 md:mt-8">
              <div className="relative w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground" size={20} />
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-[10px] px-16 py-4 md:py-5 text-foreground placeholder:text-foreground/40 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
            <h3 className="text-base md:text-lg font-bold tracking-[0.2em] uppercase text-foreground mb-4">
              Latest Articles
            </h3>
            <h4 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-foreground uppercase">
              TECH <span className="text-foreground">INSIGHTS.</span>
            </h4>
          </div>

          {filteredPosts.length > 0 ? (
            <BlogGrid initialPosts={currentPosts} />
          ) : (
            <div className="text-center py-20 text-foreground">
              No articles found matching &quot;{searchQuery}&quot;
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 md:mt-20 gap-4">
              <button 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-[10px] text-foreground font-bold hover:text-gold transition-all bg-white/30 dark:bg-black/80 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-[10px] font-bold flex items-center justify-center transition-all ${
                    currentPage === page
                      ? "bg-primary text-black font-black"
                      : "text-foreground hover:bg-primary/5 bg-white/30 dark:bg-black/80"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 rounded-[10px] text-foreground font-bold hover:text-gold transition-all bg-white/30 dark:bg-black/80 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
