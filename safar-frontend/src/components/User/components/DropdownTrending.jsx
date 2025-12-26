"use client"


// import { useNavigate } from "react-router-dom";
import { useRouter } from 'next/navigation';

const DropdownTrending = ({ title,  items , setState}) => {


    // const navigate = useNavigate()
    const router = useRouter();

  return (
    <div className=" w-[95%] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold ">{title}</h3>
        <button
          onClick={() => router.push('/trending')}
          className="flex items-center justify-center text-sm p-2 transition duration-300 hover:rounded-full "
        >
          <span className="mr-2">Show More</span>
          <span className="bg-orange-500 p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4 ">
        {items.map((item, index) => (
          <div
            onClick={() =>{
              setState((prevState) => ({
                ...prevState,
                isTreddingDropdownOpen: false
              }))
              router.push(`/itinerary/${item.route_map}`, {
                state: { refresh: true }
              })}
            }
            style={{
              backgroundImage: `url(${item.view_images[0]})`
            }}
            key={index}
            className=" overflow-hidden  rounded-lg  flex flex-col justify-end h-32  text-white  bg-no-repeat  bg-cover bg-center hover:bg-gray-200 transition duration-300"
          >
            <h4 className="text-sm font-semibold text-center bg-black/30 py-2 ">
              {item.title}
            </h4>
          
          </div>
        ))}
      </div>
    </div>
  )
}

export default DropdownTrending;