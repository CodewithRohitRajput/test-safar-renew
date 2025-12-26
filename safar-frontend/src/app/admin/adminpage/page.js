import Admin from '@/components/Admin/Admin'
import React from 'react'

const page = () => {
  return (
    <div>
        <Admin/>
    </div>
  )
}

export default page

// import { redirect } from "next/navigation"; // ✅ Import redirect helper
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
//  import Admin from '@/components/Admin/Admin'

// export default async function AdminHomePage() {
//   const session = await getServerSession(authOptions);

//   // ✅ Redirect to login if no session
//   if (!session) {
//     redirect("/Admin/Login");
//   }

//   return (
//     <div>
//       <Admin/>
//     </div>
//   );
// }

