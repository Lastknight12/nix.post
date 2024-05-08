import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { NextUI } from "./providers/NextUI";
import NextAuthProvider from "./providers/NextAuth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "last/blog",
  description: "Personal blog app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} h-full !bg-black text-gray-200 bg-gradient-to-r from-[#0f0f0f] via-[#12275653] to-[#0f0f0f]`}>
        <TRPCReactProvider>
          <NextUI>
            <NextAuthProvider>
              {children}
            </NextAuthProvider>
          </NextUI>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
