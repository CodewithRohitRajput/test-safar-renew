"use client"

import { useRouter } from 'next/navigation'

const ReviewCard = ({ review, page }) => {
  const router = useRouter()

  // Safety checks and fallbacks
  const reviewerName = review.reviewer_name || review.customerName || 'Anonymous';
  const reviewText = review.text || review.reviewText || '';
  const reviewerImage = review.reviewer_image || review.reviewerImageUrl || null;
  const rating = review.rating || 0;

  return (
    <div
      className="relative flex h-auto w-full md:w-[340px] lg:w-[380px] md:shrink-0 flex-col 
      rounded-3xl bg-white p-4 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] 
      hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out
      hover:translate-y-[-2px] mb-2"
    >
      {/* Quote mark */}
      <div className="absolute left-4 md:left-8 top-4 md:top-8 text-4xl md:text-5xl font-serif text-gray-100">
        "
      </div>

      {/* Review text */}
      <div className="mb-4 md:mb-8 flex-grow pt-4 md:pt-8">
        <div className="h-[80px] md:h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
          <p className="text-[13px] md:text-base leading-relaxed text-gray-800">
            {reviewText}
          </p>
        </div>
      </div>

      {/* Reviewer info */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 md:space-x-3 mb-1">
          {reviewerImage ? (
            <img
              className="h-8 w-8 md:h-12 md:w-12 rounded-full object-cover"
              src={reviewerImage}
              alt={reviewerName}
            />
          ) : (
            <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-rose-500 text-base md:text-xl text-white">
              {reviewerName && reviewerName.length > 0 ? reviewerName[0].toUpperCase() : 'A'}
            </div>
          )}
          <h3 className="text-[13px] md:text-base font-medium text-gray-800">
            {reviewerName}
          </h3>
        </div>

        <div className="flex space-x-0.5 md:space-x-1">
          {[...Array(Math.max(0, Math.min(5, rating)))].map((_, index) => (
            <span key={index} className="text-sm md:text-lg text-yellow-400">
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Bottom section - only for home page */}
      {page === 'home' && (
        <div className="mt-2 md:mt-4 border-t border-gray-100 pt-2 md:pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {review.itineraryId || review.itinerary ? (
                <>
                  {(review.itinerary?.view_images?.[0] || review.itinerary?.images?.[0]) && (
                    <img
                      src={review.itinerary?.view_images?.[0] || review.itinerary?.images?.[0]}
                      alt={review.itinerary?.title || review.itinerary?.name}
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <h4 className="text-xs md:text-sm font-medium text-gray-700 truncate">
                    {review.itinerary?.title || review.itinerary?.name}
                  </h4>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-orange-500"
                    >
                      <path
                        fill="currentColor"
                        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4 2h8v2H8V8zm0 4h8v2H8v-2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">
                    Similar Trips
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() =>
                router.push(
                  (review?.itineraryId || review?.itinerary)
                    ? `/itinerary/${review?.itinerary?.route_map || review?.itineraryId?.route_map || ''}`
                    : '/explore/all-trips'
                )
              }
              className="inline-flex items-center rounded-full bg-orange-500 hover:bg-orange-600
              px-2.5 md:px-4 py-1 md:py-2 text-[12px] md:text-sm font-medium text-white whitespace-nowrap
              transition-all duration-200 ease-in-out"
            >
              Browse Trips →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewCard