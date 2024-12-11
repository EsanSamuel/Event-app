import { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prismadb";
import { AdapterUser } from "next-auth/adapters";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: "31527447456-kfb81f6kluj3qnr79cfajg9cri9q940h.apps.googleusercontent.com",
      clientSecret: "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"
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("No credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          console.log("User does not exist!");
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials?.password!,
          user?.hashedPassword!
        );

        if (!isPasswordCorrect) {
          console.log("Incorrect Password!");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await prisma?.user?.findUnique({
        where: {
          email: session?.user?.email,
        },
      });
      if (user) {
        session.user.id = user.id.toString();
      }

      return session;
    },
    async signIn({ user }: { user: User | AdapterUser }) {
      try {
        const userExist = await prisma?.user?.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (!userExist) {
          await prisma?.user?.create({
            data: {
              username: user.name!,
              email: user.email!,
              image: user.image,
            },
          });
        }
        console.log("Log in successful!")
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
