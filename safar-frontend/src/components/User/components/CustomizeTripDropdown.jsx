// "use client"

// import { useRouter } from "next/navigation"

// const CustomizeTripDropdown = ({ itineraries, setState }) => {
//   const router = useRouter()
  
//   // Check if itineraries is an array and has data
//   if (!itineraries || !Array.isArray(itineraries) || itineraries.length === 0) {
//     return (
//       <div className="w-full p-2">
//         <div className="text-center text-gray-500 text-xs py-2">
//           No customizable trips available
//         </div>
//       </div>
//     )
//   }
  
//   // Limit to 6 itineraries
//   const limitedItineraries = itineraries.slice(0, 6)

//   // Function to extract only the city name from the title
//   const getCityName = (title) => {
//     if (!title) return 'Unknown'
    
//     const cityName = title.split('|')[0]?.trim() || 
//                     title.split('-')[0]?.trim() || 
//                     title.split('|')[0]?.trim() ||
//                     title
    
//     return cityName
//   }

//   return (
//     <div className="w-full p-2">
//       <div className="space-y-0">
//         {limitedItineraries.map((itinerary, index) => (
//           <div
//             key={index}
//             onClick={() => {
//               setState((prevState) => ({
//                 ...prevState,
//                 isCustomizeDropdownOpen: false
//               }))
//               router.push(`/itinerary/${itinerary.route_map}`)
//             }}
//             className="flex items-center p-2 hover:bg-orange-50 rounded-md cursor-pointer transition-all duration-200 group"
//           >
//             <span className="text-gray-800 font-medium text-sm group-hover:text-orange-600 transition-colors">
//               {getCityName(itinerary.title)}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CustomizeTripDropdown