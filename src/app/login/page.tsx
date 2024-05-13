"use client";

import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGoogle } from "react-icons/fa";


export default function Sigin() {
  return (
    <div className=" flex flex-col gap-2 h-full w-full items-center justify-center">
      <Button
        variant="flat"
        onClick={() => signIn("discord", { redirect: true, callbackUrl: `https://${process.env.NEXTAUTH_URL}` })}
        color="primary"
      >
        Login with Discord <FaDiscord />
      </Button>
      <Button
        variant="flat"
        onClick={() => signIn("google", { redirect: true, callbackUrl: `https://${process.env.NEXTAUTH_URL}` })}
        color="primary"
      >
        Login with Google <FaGoogle />
      </Button>
    </div>
  );
}
