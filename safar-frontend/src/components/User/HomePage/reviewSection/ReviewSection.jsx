"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchReviews } from '../.../../../../../redux/thunks/fetchReviews';

import ReviewCard from "./components/ReviewCard";
import ReviewSkeleton from "./components/ReviewSkeleton";
import ReviewHeader from "./components/ReviewHeader";
import { fetchReviews } from "@/lib/thunks/fetchReviews";

// CSS for hiding scrollbars
const styles = `
  .reviews-scrollbar-hide {
    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
  }
  
  .reviews-scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

const ReviewSection = ({ page = "home", itineraryId = null }) => {
  const reviewContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollInterval = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const resumeAutoScrollTimeout = useRef(null);

  const reviews = useSelector((state) => {
    if (page === "home") {
      return state.global.landingPageReviews || [];
    } else if (page === "itinerary" && itineraryId) {
      return state.global[`itineraryReviews_${itineraryId}`] || [];
    }
    return [];
  });

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll effect for mobile
  useEffect(() => {
    if (!isMobile || !reviews || reviews.length <= 1 || !isAutoScrolling)
      return;

    autoScrollInterval.current = setInterval(() => {
      if (!userInteracted) {
        setCurrentSlide((prev) => (prev + 1) % reviews.length);
      }
    }, 7000);

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [reviews, isMobile, isAutoScrolling, userInteracted]);

  // Handle slide changes
  useEffect(() => {
    if (
      !isMobile ||
      !reviewContainerRef.current ||
      !reviews ||
      reviews.length === 0
    )
      return;

    const container = reviewContainerRef.current;
    const cardWidth = container.scrollWidth / reviews.length;
    container.scrollTo({
      left: currentSlide * cardWidth,
      behavior: "smooth",
    });
  }, [currentSlide, isMobile, reviews]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
      if (resumeAutoScrollTimeout.current)
        clearTimeout(resumeAutoScrollTimeout.current);
    };
  }, []);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  const loadReviews = useCallback(
    async (currentPage) => {
      try {
        const params = {
          page: currentPage,
          ...(page === "home" && { isLandingPage: true }),
          ...(page === "itinerary" && { itineraryId }),
        };

        const result = await dispatch(
          fetchReviews(params.page, params.isLandingPage, params.itineraryId)
        );

        if (!result.success || result.reviews?.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
        setHasMore(false);
      }
    },
    [dispatch, page, itineraryId]
  );

  // Load more reviews when page changes
  useEffect(() => {
    if (pageNum > 1) {
      loadReviews(pageNum);
    }
  }, [pageNum, loadReviews]);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    loadReviews(1).finally(() => setIsLoading(false));
  }, [loadReviews]);

  if (isLoading) {
    return (
      <div className="bg-white py-6 md:py-8">
        <div className="p-4 text-left md:p-8">
          <div className="mb-4 md:mb-6">
            <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-3" />
            {page === "home" && (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="h-6 w-6 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            )}
          </div>

          <div className="relative h-[calc(100vh-200px)] md:h-auto">
            <div
              className="flex flex-col md:flex-row items-stretch md:space-x-6 space-y-4 md:space-y-0 
              md:overflow-x-auto md:no-scrollbar max-h-full overflow-y-auto md:overflow-y-visible
              px-1 md:px-2 pb-6 md:pb-4 pt-2"
            >
              {[...Array(3)].map((_, index) => (
                <ReviewSkeleton key={index} page={page} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="bg-white py-4 md:py-8">
        <div className="px-4 md:px-8">
          <ReviewHeader page={page} />

          <div className="relative">
            <div
              ref={reviewContainerRef}
              className={`flex flex-row items-stretch 
                ${isMobile ? "space-x-0" : "space-x-3 md:space-x-6"} 
                overflow-x-auto reviews-scrollbar-hide
                px-1 md:px-2 
                pb-6 md:pb-4 
                pt-2
                ${isMobile ? "snap-x snap-mandatory" : ""}`}
              onTouchStart={() => {
                setIsAutoScrolling(false);
                setUserInteracted(true);
                if (autoScrollInterval.current)
                  clearInterval(autoScrollInterval.current);
                if (resumeAutoScrollTimeout.current)
                  clearTimeout(resumeAutoScrollTimeout.current);
              }}
              onTouchEnd={() => {
                // Restart auto-scroll only after 10 seconds of no user interaction
                resumeAutoScrollTimeout.current = setTimeout(() => {
                  setIsAutoScrolling(true);
                  setUserInteracted(false);
                }, 10000); // 10 seconds delay
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id || index}
                  className={isMobile ? "w-full flex-shrink-0 snap-start" : ""}
                >
                  <ReviewCard review={review} page={page} />
                </div>
              ))}

              {/* Loading trigger element */}
              {hasMore && (
                <div ref={loadMoreRef} className="w-1 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewSection;
