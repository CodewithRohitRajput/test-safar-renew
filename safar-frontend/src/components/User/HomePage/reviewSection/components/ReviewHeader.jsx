import { FcGoogle } from 'react-icons/fc';

const ReviewHeader = ({ page }) => {
    
    return (
      <div className="mb-4 md:mb-8 flex flex-col items-center text-center">
        <div>
          <h2 className="mb-3 text-2xl md:text-3xl lg:text-4xl font-semibold">
            {page === 'home' ? 'What Our Travelers Say About Us' : 'Trip Reviews'}
          </h2>
          {page === 'home' && (
          <div className="mb-4 flex flex-col-reverse items-center justify-center gap-1 md:flex-row md:space-x-2 md:gap-0">
  <div className="flex space-x-1">
    {[...Array(5)].map((_, index) => (
      <span key={index} className="text-lg md:text-xl lg:text-2xl text-yellow-400">★</span>
    ))}
    <FcGoogle className="text-xl md:text-2xl lg:text-3xl" />
  </div>
  <span className="text-sm md:text-base lg:text-lg text-center md:text-left">4.9 Rating by 5K Travellers</span>
</div>

          )}
        </div>
      </div>
    );
  };
  
  export default ReviewHeader;