// "use client"

// import { useRouter } from "next/navigation"

// const InternationalTripDropdown = ({ categories, setState }) => {
//   const router = useRouter()
  
//   // Check if categories is an array and has data
//   if (!categories || !Array.isArray(categories) || categories.length === 0) {
//     return (
//       <div className="w-full p-2">
//         <div className="text-center text-gray-500 text-xs py-2">
//           No international trips available
//         </div>
//       </div>
//     )
//   }
  
//   // Limit to 6 categories
//   const limitedCategories = categories.slice(0, 6)

//   return (
//     <div className="w-full p-2">
//       <div className="space-y-0">
//         {limitedCategories.map((category, index) => (
//           <div
//             key={index}
//             onClick={() => {
//               setState((prevState) => ({
//                 ...prevState,
//                 isInternationalDropdownOpen: false
//               }))
//               const routePath = category.route_map || category.id || category.name?.toLowerCase().replace(/\s+/g, '-')
//               router.push(`/explore/${routePath}`)
//             }}
//             className="flex items-center p-2 hover:bg-orange-50 rounded-md cursor-pointer transition-all duration-200 group"
//           >
//             <span className="text-gray-800 font-medium text-sm group-hover:text-orange-600 transition-colors">
//               {category.name || `Category ${index + 1}`}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default InternationalTripDropdown