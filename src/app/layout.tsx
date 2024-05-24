import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { NextUI } from "./providers/NextUI";
import NextAuthProvider from "./providers/NextAuth";
import { Toaster } from "react-hot-toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NavigationProvider } from "./providers/NavigationProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "last/blog",
  description: "Personal blog app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} relative z-[1] h-full bg-transparent bg-gradient-to-r text-gray-200`}
      >
        <TRPCReactProvider>
          <NextUI>
            <NextAuthProvider>
              <NextThemesProvider attribute="class" defaultTheme="dark">
                <Toaster />
                <NavigationProvider />
                <div className=" pointer-events-none fixed top-0 -z-[1] h-full w-full blur-[100px] light light:bg-white dark:bg-black">
                  <div className=" fixed right-28 top-20 h-[430px] w-[430px] rounded-full light light:bg-[#b32bb142] dark:bg-[#b32bb12e]"></div>
                  <div className=" fixed right-28 top-96 h-[430px] w-[430px] rounded-full light light:bg-[#292ec13b] dark:bg-[#292ec12b]"></div>
                  <div className=" fixed bottom-0 left-12 h-96 w-44 -rotate-45 light light:bg-[#3129c149] dark:bg-[#3129c144]"></div>
                </div>
                <main className="my-4w-full z-1 z-10 justify-center">
                  <div className="mx-auto mb-4 max-w-[1000px] flex-col gap-20 px-5">
                    {children}
                  </div>
                </main>
              </NextThemesProvider>
            </NextAuthProvider>
          </NextUI>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
