// // // src/components/Sidebar.jsx

// // "use client"

// // import { light } from '@/_assets/themes/themes'
// // import React, { useEffect, useState } from 'react'
// // import { Link, useLocation } from 'react-router-dom'
// // import safarlogoimg from '@/_assets/svgs/logo/Safar_Final_Logo.svg'
// // import CustomText from './CustomText'
// // import Itinerary from '@/_assets/svgs/logo/Itinerary'
// // import Category from '@/_assets/svgs/logo/Category'
// // import Content from '@/_assets/svgs/logo/Content'
// // import Bookings from '@/_assets/svgs/logo/Bookings'
// // import Requests from '@/_assets/svgs/logo/Requests'
// // import Settings from '@/_assets/svgs/logo/Settings'
// // import Dashboard from '@/_assets/svgs/logo/Dashboard'
// // import { MdRateReview } from 'react-icons/md'

// // const Sidebar = ({ onHover, isOpen }) => {
// //   const location = useLocation()
// //   let location_change = location.pathname
// //   const [activePage, setActivePage] = useState(location.pathname)
// //   useEffect(() => {
// //     setActivePage(location_change)
// //   }, [location_change])

// //   const NavItem = ({ path, Logo_path, title }) => {
// //     const isActive = activePage === path
// //     const [itemstate, setitemstate] = useState({ is_hovering: false })
// //     return (
// //       <Link
// //         onMouseEnter={() =>
// //           setitemstate((prevs) => ({ ...prevs, is_hovering: true }))
// //         }
// //         onMouseLeave={() =>
// //           setitemstate((prevs) => ({ ...prevs, is_hovering: false }))
// //         }
// //         onClick={() => setActivePage(path)}
// //         to={path}
// //         className={`hover:bg-signinbtnbackground hover:text-white ${
// //           isActive ? 'bg-signinbtnbackground text-white' : ''
// //         } p-3 rounded ml-2 select-none`}
// //       >
// //         <div className="flex relative">
// //           <div
// //             className={`${
// //               itemstate.is_hovering || isActive
// //                 ? 'bg-signinbtnbackground'
// //                 : 'bg-white'
// //             }  rounded-br rounded-tr py-[1.29rem] px-[0.15rem] absolute -left-9 -top-[0.70rem]`}
// //           />
// //           <div className="flex">
// //             <div className="mr-3">
// //               <Logo_path
// //                 color={
// //                   itemstate.is_hovering || isActive
// //                     ? 'white'
// //                     : light.sidebarborder
// //                 }
// //               />
// //             </div>

// //             <CustomText fontsize="16px" content={title} />
// //           </div>
// //         </div>
// //       </Link>
// //     )
// //   }
// //   return (
// //     <div
// //       style={{ borderRight: '1px solid #3F3F441A' }}
// //       className={`sm:block hidden fixed top-0 left-0 w-64 h-full bg-white text-black  flex-col p-4 transition-transform duration-300 z-40 'translate-x-0 '
// //        `}
// //       // ${
// //       //     isOpen ? 'translate-x-0' : '-translate-x-full'
// //       //   }
// //       onMouseEnter={() => onHover(true)}
// //       onMouseLeave={() => onHover(false)}
// //     >
// //       <img
// //         src={safarlogoimg}
// //         alt="logo"
// //         className=" w-40 h-40 self-center object-contain object-center"
// //       />
// //       <nav className="flex flex-col space-y-2">
// //         <NavItem
// //           path={'/Admin/Dashboard'}
// //           Logo_path={Dashboard}
// //           title={'Dashboard'}
// //         />
// //         <NavItem
// //           path={'/Admin/Itinerary'}
// //           Logo_path={Itinerary}
// //           title={'Itinerary'}
// //         />
// //         <NavItem
// //           path={'/Admin/Category'}
// //           Logo_path={Category}
// //           title={'Category'}
// //         />
// //         <NavItem
// //           path={'/Admin/Content'}
// //           Logo_path={Content}
// //           title={'Contents'}
// //         />
// //         <NavItem
// //           path={'/Admin/Review'}
// //           Logo_path={MdRateReview}
// //           title={'Review'}
// //         />
// //         <NavItem
// //           path={'/Admin/Bookings'}
// //           Logo_path={Bookings}
// //           title={'Bookings'}
// //         />
// //         <NavItem
// //           path={'/Admin/Request'}
// //           Logo_path={Requests}
// //           title={'Requests'}
// //         />
// //         <NavItem
// //           path={'/Admin/AdminPage'}
// //           Logo_path={Settings}
// //           title={'Admins'}
// //         />
// //       </nav>
// //     </div>
// //   )
// // }

// // export default Sidebar


// "use client"

// import { light } from "@/_assets/themes/themes";
// import React, { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";
// import safarlogoimg from "@/_assets/svgs/logo/Safar_Final_Logo.svg";
// import CustomText from "./CustomText";
// import Itinerary from "@/_assets/svgs/logo/Itinerary";
// import Category from "@/_assets/svgs/logo/Category";
// import Content from "@/_assets/svgs/logo/Content";
// import Bookings from "@/_assets/svgs/logo/Bookings";
// import Requests from "@/_assets/svgs/logo/Requests";
// import Settings from "@/_assets/svgs/logo/Settings";
// import Dashboard from "@/_assets/svgs/logo/Dashboard";
// import { MdRateReview } from "react-icons/md";

// const Sidebar = ({ onHover, isOpen }) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [activePage, setActivePage] = useState(pathname);

//   useEffect(() => {
//     setActivePage(pathname);
//   }, [pathname]);

//   const NavItem = ({ path, Logo_path, title }) => {
//     const isActive = activePage === path;
//     const [itemstate, setitemstate] = useState({ is_hovering: false });

//     return (
//       <div
//         onMouseEnter={() =>
//           setitemstate((prevs) => ({ ...prevs, is_hovering: true }))
//         }
//         onMouseLeave={() =>
//           setitemstate((prevs) => ({ ...prevs, is_hovering: false }))
//         }
//         onClick={() => {
//           setActivePage(path);
//           router.push(path);
//         }}
//         className={`hover:bg-signinbtnbackground hover:text-white ${
//           isActive ? "bg-signinbtnbackground text-white" : ""
//         } p-3 rounded ml-2 select-none cursor-pointer`}
//       >
//         <div className="flex relative">
//           <div
//             className={`$ {
//               itemstate.is_hovering || isActive
//                 ? "bg-signinbtnbackground"
//                 : "bg-white"
//             }  rounded-br rounded-tr py-[1.29rem] px-[0.15rem] absolute -left-9 -top-[0.70rem]`}
//           />
//           <div className="flex">
//             <div className="mr-3">
//               <Logo_path
//                 color={
//                   itemstate.is_hovering || isActive
//                     ? "white"
//                     : light.sidebarborder
//                 }
//               />
//             </div>

//             <CustomText fontsize="16px" content={title} />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div
//       style={{ borderRight: "1px solid #3F3F441A" }}
//       className={`sm:block hidden fixed top-0 left-0 w-64 h-full bg-white text-black flex-col p-4 transition-transform duration-300 z-40`}
//       onMouseEnter={() => onHover(true)}
//       onMouseLeave={() => onHover(false)}
//     >
//       <Image
//         src={safarlogoimg}
//         alt="logo"
//         className="w-40 h-40 self-center object-contain object-center"
//       />
//       <nav className="flex flex-col space-y-2">
//         <NavItem path="/Admin/Dashboard" Logo_path={Dashboard} title="Dashboard" />
//         <NavItem path="/Admin/Itinerary" Logo_path={Itinerary} title="Itinerary" />
//         <NavItem path="/Admin/Category" Logo_path={Category} title="Category" />
//         <NavItem path="/Admin/Content" Logo_path={Content} title="Contents" />
//         <NavItem path="/Admin/Review" Logo_path={MdRateReview} title="Review" />
//         <NavItem path="/Admin/Bookings" Logo_path={Bookings} title="Bookings" />
//         <NavItem path="/Admin/Request" Logo_path={Requests} title="Requests" />
//         <NavItem path="/Admin/AdminPage" Logo_path={Settings} title="Admins" />
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { light } from '@/_assets/themes/themes'
import safarlogoimg from '@/_assets/svgs/logo/Safar_Final_Logo.svg'
import CustomText from './CustomText'

import Itinerary from '@/_assets/svgs/logo/Itinerary'
import Category from '@/_assets/svgs/logo/Category'
import Content from '@/_assets/svgs/logo/Content'
import Bookings from '@/_assets/svgs/logo/Bookings'
import Requests from '@/_assets/svgs/logo/Requests'
import Settings from '@/_assets/svgs/logo/Settings'
import Dashboard from '@/_assets/svgs/logo/Dashboard'
import EnquiryIcon from '@/_assets/svgs/logo/EnquiryIcon'
import Location from "@/_assets/svgs/logo/Location";
import HeadsetIcon from "@/_assets/svgs/logo/HeadsetIcon";



import { MdRateReview } from 'react-icons/md'
import Image from 'next/image'
import { localStorageHelper } from '@/helper/storageHelper'
import { useSelector } from 'react-redux'
import HandshakeIcon from '@/_assets/svgs/logo/HandshakeIcon'

const Sidebar = ({ onHover }) => {
  const pathname = usePathname()
  const [activePage, setActivePage] = useState(pathname)
  const {userData} = useSelector((state)=> state.global);


  const [isVisble, setIsVisible] = useState(userData? true:false);

  useEffect(() => {
    setActivePage(pathname)
  }, [pathname])


  useEffect(()=> {
      if(localStorageHelper.getItem('login_data') == null){

        if(!userData)
          setIsVisible(false)
        }


    }, [userData])

  const NavItem = ({ path, Logo_path, title }) => {
    const isActive = activePage === path
    const [itemstate, setitemstate] = useState({ is_hovering: false })

    return (
      <Link href={path} onClick={() => setActivePage(path)}>
        <div
          onMouseEnter={() => setitemstate({ is_hovering: true })}
          onMouseLeave={() => setitemstate({ is_hovering: false })}
          className={`hover:bg-signinbtnbackground hover:text-white ${
            isActive ? 'bg-signinbtnbackground text-white' : ''
          } p-3 rounded ml-2 select-none`}
        >
          <div className="flex relative">
            <div
              className={`${
                itemstate.is_hovering || isActive
                  ? 'bg-signinbtnbackground'
                  : 'bg-white'
              } rounded-br rounded-tr py-[1.29rem] px-[0.15rem] absolute -left-9 -top-[0.70rem]`}
            />
            <div className="flex items-center">
              <div className="mr-3">
                {typeof Logo_path === 'function' ? (
                  <Logo_path
                    color={
                      itemstate.is_hovering || isActive
                        ? 'white'
                        : light.sidebarborder
                    }
                    size={20}
                  />
                ) : null}
              </div>
              <CustomText fontsize="16px" content={title} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

return (
<div className=''>
    {userData?.admin?.role == "SUPERADMIN" && (<div 
    style={{ borderRight: '1px solid #3F3F441A' }}
    className="sm:block hidden fixed top-0 left-0 w-64 h-full bg-white text-black flex flex-col transition-transform duration-300 z-40"
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
  >
    {/* Logo Section - Fixed at top */}
    <div className="flex-shrink-0 p-4">
      <Image
        src={safarlogoimg}
        alt="logo"
        className="w-32 h-32 mx-auto object-contain object-center"
      />
    </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        <NavItem path="/admin/dashboard" Logo_path={Dashboard} title="Dashboard" />
        <NavItem path="/admin/itinerary" Logo_path={Itinerary} title="Itinerary" />
        <NavItem path="/admin/category" Logo_path={Category} title="Category" />
        <NavItem path="/admin/location" Logo_path={Location} title="Locations" />
        <NavItem path="/admin/content" Logo_path={Content} title="Contents" />
        <NavItem path="/admin/review" Logo_path={MdRateReview} title="Review" />
        <NavItem path="/admin/bookings" Logo_path={Bookings} title="Bookings" />
        <NavItem path="/admin/request" Logo_path={Requests} title="Requests" />
        <NavItem path="/admin/enquiries" Logo_path={EnquiryIcon} title="Customize Enquiry" />
        <NavItem path="/admin/leads" Logo_path={HeadsetIcon} title="Leads" />
        <NavItem path="/admin/services"  Logo_path={HandshakeIcon} title="Services" />
        <NavItem path="/admin/adminpage" Logo_path={Settings} title="Admins" />
      </nav>
    </div>)}
  </div>
  
  )
}

export default Sidebar
