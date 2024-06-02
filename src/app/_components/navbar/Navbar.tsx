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
import UserInfo from "./UserInfo";
import { useState } from "react";
import type { Burger, NavUser } from "~/types/types";
import LoginDropdown from "../modal/Logout";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "../../../../public/Direct.svg";

export default function Navigation({ session }: NavUser) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems: Burger = [
    { name: "Admin Dashboard", href: "/admin", type: "admin" },
    { name: "Profile", href: `/profile/${session?.user.name}`, type: "link" },
  ];

  const handleCreatePost = () => {
    if (session) {
      router.push("/post/create");
    } else {
      toast.error("Login to create posts");
    }
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className=" border-b-2 light light:border-none light:bg-transparent light:text-black dark:border-b-[#4f4f4fc9] dark:text-white"
      isBlurred
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`sm:hidden ${!session && "hidden"}`}
        />
        <NavbarBrand>
          <Link href="/" className=" flex items-center">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <Image src={logo} width={50} height={50} alt="site logo" />
            <p className=" font-montserrat font-medium max-[360px]:hidden">
              Nix
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end" className=" max-[440px]:gap-2">
        <NavbarItem>
          <Button
            size="sm"
            onClick={handleCreatePost}
            className="light light:bg-[#62626b] light:text-white dark:bg-[#a1a1aa] dark:text-black"
          >
            Write <FiEdit3 size={20} className=" inline-block" />
          </Button>
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
                "rounded-xl p-2 light light:bg-[#62626b] dark:bg-[#a1a1aa]"
              }
            >
              <Link
                className="w-full light light:bg-[#62626b] light:text-white dark:bg-[#a1a1aa] dark:text-black"
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
