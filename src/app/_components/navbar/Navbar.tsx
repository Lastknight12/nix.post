"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import UserInfo from "./UserInfo";
import LoginDropdown from "../dropdown/LoginDropDown";
import { LiaEditSolid } from "react-icons/lia";
import type { Session } from "next-auth";

interface NavUserProps {
  session: Session | null;
}

export default function Navigation({ session }: NavUserProps) {
  return (
    <Navbar
      className="border-b-2 light light:border-none light:bg-transparent light:text-black dark:border-b-[#4f4f4fc9] dark:text-white"
      isBlurred
    >
      <NavbarContent>
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            <p className="font-comfortaa font-medium leading-3 text-[#ffffffab] contrast-0">
              NixShare
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end" className="max-[440px]:gap-2">
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
    </Navbar>
  );
}
