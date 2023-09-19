import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await axios.post(
          `http://localhost:3001/auth/login`,
          {
            identifier: credentials?.identifier,
            password: credentials?.password,
          },
          {
            headers: {
              "X-UserType": "virtual-nurse",
            },
          }
        );

        if (res.status === 200) {
          return { id: res.data.user._id };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
});
