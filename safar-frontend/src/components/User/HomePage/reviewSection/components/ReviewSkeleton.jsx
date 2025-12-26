const ReviewSkeleton = ({ page }) => (
    <div className="relative flex h-auto w-full md:w-[340px] lg:w-[380px] md:shrink-0 flex-col 
      rounded-3xl bg-white p-4 md:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
      {/* Quote mark */}
      <div className="absolute left-4 md:left-8 top-4 md:top-8">
        <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
      </div>
  
      {/* Review text */}
      <div className="mb-6 md:mb-8 flex-grow pt-6 md:pt-8">
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      </div>
  
      {/* Reviewer info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
  
      {/* Bottom section - only for home page */}
      {page === 'home' && (
        <div className="mt-3 md:mt-4 border-t border-gray-100 pt-3 md:pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-8 w-24 rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
  
  export default ReviewSkeleton;