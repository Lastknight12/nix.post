"use client";

import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGoogle } from "react-icons/fa";

export default function Sigin() {
  return (
    <div className=" flex h-full w-full flex-col items-center justify-center gap-2">
      <Button
        variant="flat"
        onClick={() =>
          signIn("discord", {
            redirect: true,
            callbackUrl: `https://${process.env.NEXTAUTH_URL}`,
          })
        }
        color="secondary"
      >
        Login with Discord <FaDiscord />
      </Button>
      <Button
        variant="flat"
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: `https://${process.env.NEXTAUTH_URL}`,
          })
        }
        color="secondary"
      >
        Login with Google <FaGoogle />
      </Button>
    </div>
  );
}
