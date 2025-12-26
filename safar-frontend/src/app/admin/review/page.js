import Review from '@/components/Admin/Review2'
import React from 'react'

const page = () => {
  return (
    <div>
        <Review/>
    </div>
  )
}

export default page

// import { redirect } from "next/navigation"; 
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Review from '@/components/Admin/Review2'

// export default async function AdminHomePage() {
//   const session = await getServerSession(authOptions);

//   // ✅ Redirect to login if no session
//   if (!session) {
//     redirect("/Admin/Login");
//   }

//   return (
//     <div>
//       <Review/>
//     </div>
//   );
// }

