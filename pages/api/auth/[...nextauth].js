import { MongoClient } from 'mongodb';
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  session: {
    strategy: "jwt",
  },  
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token = user;
      }

      if(account) {
        token.accessToken = account.access_token
      }

      return {...token}
    },

    async session({ session, token }) { // this token return above jwt()
      session.user = token;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await MongoClient.connect(process.env.MONGODB_URL);

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('no_user_found');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('invalid_password')
        }

        client.close();
        return user;
      },
    }),
  ],
});