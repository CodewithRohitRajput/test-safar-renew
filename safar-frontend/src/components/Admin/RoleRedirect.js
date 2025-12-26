"use client"
import React, { useEffect, useState } from "react"

import { usePathname, useRouter } from "next/navigation"

const RoleRedirect = ({role}) => {
    const router = useRouter()
    const pathname = usePathname()

    
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
        const myData = localStorage.getItem("login_data")||null;
  
        if(!myData)
            router.push("/")

          const parsedData = JSON.parse(myData);
          if(parsedData?.admin){
             if(parsedData?.admin?.role == "SUPERADMIN"){
                router.push("/admin/dashboard")
          }else{
            router.push("/")
          }
        }
    } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
  
      fetchUserData()
    }, [])
    

    return null 
  }
  
  export default RoleRedirect