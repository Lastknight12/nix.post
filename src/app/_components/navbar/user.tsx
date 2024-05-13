import type { Session } from "next-auth";
import { Button, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import { FaPlus } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

import LogoutModal from "../modal/Logout";
import { CreatePostModal } from "../modal/addPost";

interface props {
  session: Session | null;
}

export default function UserInfo({ session }: props) {
  const logoutModal = useDisclosure();
  const addPost = useDisclosure();

  return (
    <div className=" flex items-center gap-3 max-sm:gap-1">
      {session?.user.role == "Admin" ? <Link href="/admin"><MdAdminPanelSettings size={40} color="#fff"/></Link> : null}

      <Button onClick={addPost.onOpen} variant="flat" size="sm" color="default">
        <FaPlus color="white" width={50} />
      </Button>

      <CreatePostModal
        isOpen={addPost.isOpen}
        onOpenChange={addPost.onOpenChange}
        onClose={addPost.onClose}
      />

      <div className=" rounded-full border-2 border-[#497ee7] p-1">
        <Link href={"#"}>
          <Image
            alt="User profile picture"
            src={`${session?.user.image}`}
            width={40}
            height={40}
            className=" rounded-full"
          />
        </Link>
      </div>
      <Button
        onClick={logoutModal.onOpen}
        variant="shadow"
        color="default"
        className=" max-sm:hidden"
      >
        Logout
      </Button>

      <LogoutModal
        isOpen={logoutModal.isOpen}
        onOpenChange={logoutModal.onOpenChange}
      />
    </div>
  );
}
