import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { username: { type: "text" }, password: { type: "password" } },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.username });
        if (!user) throw new Error("No user found.");

        const match = await bcrypt.compare(credentials!.password, user.password);
        if (!match) throw new Error("Incorrect password.");

        // Return badgeId. If missing (old users), fallback to "LEGACY"
        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email, 
          badgeId: user.badgeId || "LEGACY-USER" 
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.badgeId = token.badgeId; // <--- Pass to session
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.badgeId = user.badgeId; // <--- Store in token
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/' }
};