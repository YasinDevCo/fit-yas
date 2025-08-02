import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { verifyPassword } from "@/utils/auth";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        await connectDB();

        if (!email || !password) throw new Error("Invalid data");

        const user = await UserModel.findOne({ email });
        if (!user) throw new Error("User doesn’t exist");

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error("Incorrect email or password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.firstName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
      user?: User;
      newSession?: Session;
      trigger?: "update";
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
