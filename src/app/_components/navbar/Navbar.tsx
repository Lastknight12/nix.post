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
import { Button } from "@nextui-org/button";
import Link from "next/link";
import UserInfo from "./User";
import { useState } from "react";
import type { NavUser } from "~/types/types";
import { useTheme } from "next-themes";
import { RiColorFilterLine } from "react-icons/ri";
import LoginDropdown from "../modal/Logout";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navigation({ session }: NavUser) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { name: "Profile", href: `/profile/${session?.user.name}` },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className=" border-b-2 light light:border-none light:bg-transparent light:text-black dark:border-b-[#4f4f4fc9] dark:text-white"
      isBlurred
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-inherit max-[800px]:hidden">
              NIX.POST
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end" className=" max-[440px]:gap-2">
        <NavbarItem>
          <Button
            size="sm"
            onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            className="light light:bg-[#52525b] light:text-white dark:bg-[#a1a1aa] dark:text-black"
          >
            <RiColorFilterLine size={20} />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            size="sm"
            onClick={() => {
              session
                ? router.push("/post/create")
                : toast.error("Login to create posts");
            }}
            className="light light:bg-[#62626b] light:text-white dark:bg-[#a1a1aa] dark:text-black"
          >
            Write <FiEdit3 size={20} className=" inline-block" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          {!session ? <LoginDropdown /> : <UserInfo session={session} />}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className=" bg-transparent">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              className="w-full light light:text-[#000] dark:text-white"
              href={item.href}
              aria-label="Menu Item "
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          {session?.user.role == "Admin" && (
            <Link
              className="w-full light light:text-[#000] dark:text-white"
              href={"/admin"}
              aria-label="Menu Item"
            >
              Admin Dahsboard
            </Link>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
