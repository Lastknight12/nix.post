import "~/styles/globals.css";
import { Comfortaa, Montserrat, Open_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { NextUI } from "./providers/NextUI";
import NextAuthProvider from "./providers/NextAuth";
import { Toaster } from "react-hot-toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NavigationProvider } from "./providers/NavigationProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const comfortaa = Comfortaa({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata = {
  title: "Nix",
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
        className={`font-openSans ${openSans.variable} ${montserrat.variable} ${comfortaa.variable} relative z-[1] h-full text-gray-200 light light:bg-white dark:bg-[#1c1c1c]`}
      >
        <TRPCReactProvider>
          <NextUI>
            <NextAuthProvider>
              <NextThemesProvider attribute="class" defaultTheme="dark">
                <Toaster />
                <NavigationProvider />
                <main className="w-full">
                  <div className="mx-auto mt-3 h-full max-w-[1000px] flex-col gap-20 px-5">
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
