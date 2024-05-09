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
import React from "react";
import type { Session } from "next-auth";
import UserInfo from "./user";
import { signOut } from "next-auth/react";

export default function Navigation({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {name: "Profile", href: "/#"},
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className=" bg-transparent border-b-[#ffffff0e] border-b-1" isBlurred>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">NIX.POST</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {!session ? (
            <Button as={Link} color="primary" href="/login" variant="shadow">
              Sign Up
            </Button>
          ) : (
            <UserInfo session={session}></UserInfo>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className=" bg-transparent">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              className="w-full"
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        { session?.user ? <Button color="danger" variant="flat" className=" max-w-6" onClick={() => signOut()}>Logout</Button> : undefined}
      </NavbarMenu>
    </Navbar>
  );
}
