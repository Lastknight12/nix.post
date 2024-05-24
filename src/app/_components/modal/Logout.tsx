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
    <Dropdown>
      <DropdownTrigger>
        <Button variant="shadow" color="primary">
          Login
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">
          <Button
            color="secondary"
            onClick={() =>
              signIn("discord", {
                redirect: true,
                callbackUrl: `https://${process.env.NEXTAUTH_URL}`,
              })
            }
          >
            Login with Discord <FaDiscord />
          </Button>
        </DropdownItem>
        <DropdownItem key="new">
          <Button
            color="secondary"
            onClick={() =>
              signIn("google", {
                redirect: true,
                callbackUrl: `https://${process.env.NEXTAUTH_URL}`,
              })
            }
          >
            Login with Google <FaGoogle />
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
