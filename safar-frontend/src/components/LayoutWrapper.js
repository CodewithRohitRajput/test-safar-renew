
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/User/Navbar/Navbar";
import StoreProvider from "@/app/storeProvider";
import Footer from "./User/Footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    // console.log("Pathname:", pathname);
    // Hide navbar on any admin route
    
    setShowNavbar(()=>{
      return pathname.startsWith('/admin') ? false :true;
    });
  }, [pathname]);

  useEffect(() => {
    const isAdminRoute = pathname.startsWith("/admin");
    // setShowNavbar(!isAdminRoute);
    setShowFooter(!isAdminRoute);
  }, [pathname]);

  return (
    <StoreProvider>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </StoreProvider>
  );
}
