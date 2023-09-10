import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        identifier: { label: 'Identifier', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await axios.post(`http://localhost:3001/auth/login`, {
          identifier: credentials?.identifier,
          password: credentials?.password,
        });

        if (res.status === 200) {
          return { id: res.data.user._id };
        } else {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
