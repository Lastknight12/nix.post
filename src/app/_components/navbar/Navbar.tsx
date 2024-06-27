"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import Link from "next/link";
import UserInfo from "./UserInfo";
import { useState } from "react";
import type { Burger } from "~/types/types";
import LoginDropdown from "../dropdown/LoginDropDown";
import { LiaEditSolid, LiaMoon, LiaSun } from "react-icons/lia";
import { useTheme } from "next-themes";
import type { Session } from "next-auth";

interface NavUserProps {
  session: Session | null;
}

export default function Navigation({ session }: NavUserProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: Burger = [
    { name: "Admin Dashboard", href: "/admin", type: "admin" },
    { name: "Profile", href: `/profile/${session?.user.name}`, type: "link" },
  ];

  const { theme, setTheme } = useTheme();

  function handleThemeSwitch() {
    setTheme(theme == "dark" ? "light" : "dark");
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="border-b-2 light light:border-none light:bg-transparent light:text-black dark:border-b-[#4f4f4fc9] dark:text-white"
      isBlurred
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`sm:hidden ${!session && "hidden"}`}
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <svg
              width="26"
              height="26"
              className="mr-2 contrast-0 max-[356px]:hidden"
              viewBox="0 0 46 46"
              fill="#ffffffab"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9 0.400009L17.9 4.2C19.4 5.6 20.2 7.50001 20.2 9.60001C20.2 11.6 21 13.5 22.4 14.9L22.9 15.4L27.5 0.5"
                fill="inherit"
              />
              <path
                d="M0.300003 13.7L5.8 13.5C7.8 13.4 9.8 14.2 11.2 15.6C12.6 17 14.5 17.7 16.5 17.7H17.2L9.8 4"
                fill="inherit"
              />
              <path
                d="M0.300003 32.7L4 28.7C5.4 27.2 7.3 26.3 9.3 26.3C11.3 26.3 13.1 25.4 14.5 24L15 23.5L0 19.2"
                fill="inherit"
              />
              <path
                d="M13.9 45.9L13.6 40.4C13.5 38.4 14.2 36.4 15.6 34.9C16.9 33.5 17.7 31.5 17.6 29.6V28.9L4 36.6"
                fill="inherit"
              />
              <path
                d="M32.9 45.5L28.8 41.9C27.3 40.6 26.4 38.7 26.3 36.6C26.2 34.6 25.3 32.8 23.9 31.4L23.4 30.9L19.4 46"
                fill="inherit"
              />
              <path
                d="M45.9 31.6L40.4 32C38.4 32.2 36.4 31.5 34.9 30.1C33.4 28.8 31.5 28.1 29.5 28.2H28.8L36.8 41.6"
                fill="inherit"
              />
              <path
                d="M45 12.7L41.5 16.9C40.2 18.4 38.3 19.4 36.3 19.5C34.3 19.6 32.5 20.5 31.2 22L30.8 22.5L46 26.1"
                fill="inherit"
              />
              <path
                d="M30.9 0L31.4 5.5C31.6 7.5 31 9.50001 29.6 11.1C28.3 12.6 27.7 14.5 27.8 16.5L27.9 17.2L41.1 8.90001"
                fill="inherit"
              />
            </svg>

            <p className="font-comfortaa font-medium leading-3 text-[#ffffffab] contrast-0 max-[356px]:hidden">
              NixShare
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end" className="max-[440px]:gap-2">
        <NavbarItem>
          <button
            className="mr-2 flex items-center justify-center"
            onClick={handleThemeSwitch}
          >
            <LiaMoon size={24} className="light light:block dark:hidden" />
            <LiaSun size={22} className="light light:hidden dark:block" />
          </button>
        </NavbarItem>
        <NavbarItem>
          <Link href="/write" className="flex items-end">
            <LiaEditSolid
              className="mr-1 light light:text-defaultLight dark:text-defaultDark"
              size={24}
            />
            <p className="text-sm light light:text-defaultLight dark:text-defaultDark">
              Write
            </p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          {!session ? <LoginDropdown /> : <UserInfo session={session} />}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="bg-transparent">
        {menuItems.map((item, index) => {
          {
            if (!session) {
              return null;
            }

            if (item.type === "admin" && session?.user.role !== "Admin") {
              return null;
            }
          }
          return (
            <NavbarMenuItem
              key={index}
              className={
                "rounded-xl p-2 light light:bg-[#2e2e2e33] dark:bg-[#ffffff1a]"
              }
            >
              <Link
                className="w-full light:text-black dark:text-white"
                href={item.href!}
                aria-label={item.name}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
