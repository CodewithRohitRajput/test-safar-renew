import Bookings from '@/components/Admin/Bookings'
import React from 'react'

const page = () => {
  return (
    <div>
        <Bookings/>
    </div>
  )
}

export default page

// import { redirect } from "next/navigation"; // ✅ Import redirect helper
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Bookings from '@/components/Admin/Bookings'

// export default async function AdminHomePage() {
//   const session = await getServerSession(authOptions);

//   // ✅ Redirect to login if no session
//   // if (!session) {
//   //   redirect("/Admin/Login");
//   // }

//   return (
//     <div>
//       <Bookings/>
//     </div>
//   );
// }

