"use client";
import Login from '@/components/Admin/Loginpage'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const page = () => {

  const {userData} = useSelector((state)=> state.global);
  const router = useRouter();
  useEffect(()=>{

    if(userData && userData?.admin?.role == 'SUPERADMIN')
    {
      router.push('/admin/dashboard') 
    }

  },[userData]);

  return (
    <div><Login />
    </div>
  )
}

export default page

// import Login from '@/components/Admin/Loginpage'
// import React from 'react'
// // import { signIn } from "next-auth/react";

// const page =   async () => {
//   return (
//     <div>
//         <Login/>
//     </div>
//   )
//   // await signIn("credentials", {
//   //   redirect: true,
//   //   callbackUrl: "/Dashboard", // or Dashboard path
//   // });
// }

// export default page