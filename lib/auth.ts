import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma';
import { User, Role } from "@prisma/client";

const client = prisma;

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: Role;
    }
  }
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: Role;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    CredentialsProvider({
      name: "login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
         const user = await client.user.findFirst(
            {
            where: { email: credentials.email },
            select: { id: true, name: true, email: true, role: true, password: true }
            }
          );

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.password) {
            throw new Error("user doesn't have any password");
          }
          const isValid = await bcrypt.compare(credentials.password.trim(), user.password.trim());

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return { id: user.id.toString(), email: user.email, name: user.name, role: user.role };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as Role;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // google O-auth
      if (account?.provider === "google" && user.email) {
        try {
          let existingUser = await client.user.findFirst({ 
            where: { 
              email: user.email 
            }
          });

          if (!existingUser) {
            const newUser = await client.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                provider: account.provider,
                providerId: account.providerAccountId,
                role: 'USER'
              }
            });
            user.role = newUser.role;
            return true;
          }
          user.role = existingUser.role;
          return true; // User exists, proceed with sign-in
        } catch (error) {
          console.error("Error saving user:", error);
          return false; // Prevent sign-in if an error occurs
        }
      }

      return true; // Allow sign-in for credential-based logins
    },
  },
  
  pages: {
    signIn: "/auth/login",  // Custom login page URL
    error: "/auth/login",   // Error handling page URL
  },
  
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  httpOptions: { timeout: 10000 },
};

export default authOptions;
