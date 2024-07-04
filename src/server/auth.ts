import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: "User" | "Admin";
      likedPosts: number[];
      subname: string;
      description: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "User" | "Admin";
    likedPosts: number[];
    subname: string;
    description: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 * 30 },
  callbacks: {
    jwt: async ({ token, trigger, session }): Promise<JWT> => {
      // check if like pressed

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (trigger == "update" && session?.likedPosts) {
        // set liked posts and adapter auto update db user liked posts

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        token.likedPosts.push(session?.likedPosts);

        return token;
      }

      const subname = token.email ? "@" + token.email.split("@")[0] : "";

      // find user in db ( adapter Prisma спочатку створить юзера якшо його немає. Тому він завжди є )
      const dbuser = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      // idk how tell next auth create user with subname from token
      if (dbuser && !dbuser.subname) {
        await db.user.update({
          where: {
            id: dbuser.id,
          },
          data: {
            subname: subname,
          },
        });
      }

      // return to session default token and role, likedPosts
      return {
        sub: token.sub,
        name: dbuser!.name,
        email: dbuser!.email,
        image: dbuser!.image,
        role: dbuser!.role,
        likedPosts: dbuser!.likedPosts,
        subname: dbuser!.subname!,
        description: dbuser!.description,
      };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.sub,
          name: token.name,
          email: token.email,
          image: token.image as string,
          role: token.role,
          likedPosts: token.likedPosts,
          subname: token.subname,
          description: token.description,
        },
      };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
