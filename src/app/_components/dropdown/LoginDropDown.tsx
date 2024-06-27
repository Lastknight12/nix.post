import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGoogle } from "react-icons/fa";

export default function LoginDropdown() {
  return (
    <Dropdown className="light light:bg-[#fcfcfc] dark:bg-[#2b2b2bbe]">
      <DropdownTrigger>
        <Button
          variant="shadow"
          color="primary"
          className="mix-w-auto min-w-min"
        >
          Login
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">
          <div className="flex flex-col items-center gap-2">
            <div className="light light:text-black dark:text-white">
              Login with:
            </div>
            <div className="flex gap-2">
              <button
                className="light:text black flex items-center gap-2 rounded-lg p-2 light light:bg-[#ebebeb] light:text-black dark:bg-[#1d1d1d] dark:text-white"
                color="secondary"
                onClick={() =>
                  signIn("google", {
                    redirect: true,
                    callbackUrl: `https://${process.env.NEXTAUTH_URL}`,
                  })
                }
              >
                <FaGoogle />
              </button>
              <button
                color="secondary"
                className="light:text black flex items-center gap-2 rounded-lg p-2 light light:bg-[#ebebeb] light:text-black dark:bg-[#1d1d1d] dark:text-white"
                onClick={() =>
                  signIn("discord", {
                    redirect: true,
                    callbackUrl: `https://${process.env.NEXTAUTH_URL}`,
                  })
                }
              >
                <FaDiscord />
              </button>
            </div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
