// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// // ✅ Extract this to use it elsewhere
// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (
//           credentials.email === "admin@example.com" &&
//           credentials.password === "admin123"
//         ) {
//           return { id: 1, name: "Admin", email: "admin@example.com" };
//         }
//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/Admin/Login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// // ✅ Use the exported options
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


