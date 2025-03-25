import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import  {PrismaClient}   from '@prisma/client'

const client= new PrismaClient();

export const authOptions = {
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
         const user= await client.user.findFirst(
            {
            where:{email:credentials.email},
            select:{id:true,name:true,email:true,role:true,password:true}
            }
            )

          if (!user) {
            throw new Error("No user found with this email");
          }
            if(!user.password){
                throw new Error ("user doesn't have any password");
            }
          const isValid = await bcrypt.compare(credentials.password.trim(), user.password.trim());

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return { id: user.id.toString(), email: user.email };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id; 
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }:any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },

    async signIn({ user, account, profile }:any) {
        //google O-auth
      if (account.provider === "google") {
        try {
          
          let existingUser= await client.user.findFirst({where:{email:user.email}});

          if (!existingUser) {

            // If user doesn't exist, create a new one
            const newUser= await client.user.create({
                data:{
                    email: user.email,
                    name: user.name,
                    provider: account.provider,
                    providerId: profile.id
                }
            })
            user.id = newUser.id.toString(); 
          }
          user.id = existingUser?.id.toString();
          return true; // User creation or check successful, proceed with sign-in
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
