import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
