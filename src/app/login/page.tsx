"use client";

import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";


export default function Sigin() {
  return (
    <div className=" flex h-full w-full items-center justify-center">
      <Button
        variant="flat"
        onClick={() => signIn("discord", { redirect: true, callbackUrl: `http://${process.env.NEXTAUTH_URL}` })}
        color="primary"
      >
        Login with Discord <FaDiscord />
      </Button>
    </div>
  );
}
