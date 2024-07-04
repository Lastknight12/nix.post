"use client";

import Image from "next/image";
import { useState } from "react";
import { ZodError } from "zod";
import { api } from "~/trpc/react";
import { updateUserSchema } from "~/types/zodSchemas";
import { showError, showSuccess } from "~/utils/utils";
import UploadAvatar from "./UploadAvatar";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface SettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    subname: string | null;
    description: string;
  };
}

export default function EditSettings({ user }: SettingsProps) {
  const [subname, setSubname] = useState(user.subname!.replace(/@/g, ""));
  const [description, setDescription] = useState(user.description);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState<string>(user.image);

  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const isUserChanged =
    user.name !== name ||
    user.subname!.replace(/@/g, "") !== subname ||
    user.image !== image ||
    user.description !== description;

  function handleThemeSwitch() {
    setTheme(theme == "dark" ? "light" : "dark");
  }

  const updateUser = api.user.updateUser.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  function handleSubmit() {
    try {
      updateUserSchema.parse({
        name,
        subname,
        image,
        description,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return showError(error.errors[0]!.message);
      }
    }
    updateUser.mutate({
      name,
      subname,
      image,
      description,
    });
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center">
        <motion.div
          initial={{ opacity: 0, display: "none" }}
          animate={{
            opacity: isUserChanged ? 1 : 0,
            display: isUserChanged ? "block" : "none",
          }}
          transition={{ duration: 0.2 }}
          className="fixed right-0 top-0 z-40 w-full p-3 py-3 backdrop-blur-lg light light:bg-[#000c] dark:bg-[#0b0b0ba6]"
        >
          <div className="mx-auto flex max-w-[1000px] items-center justify-between">
            <p>Save changes?</p>
            <div className="flex">
              <button
                disabled={!isUserChanged || updateUser.isPending}
                className="mr-2 flex items-center rounded-lg bg-success-500 p-1 px-3 py-2 text-black transition-opacity disabled:opacity-45"
                onClick={handleSubmit}
              >
                {updateUser.isPending && (
                  <Spinner
                    color="default"
                    size="sm"
                    className="mr-2"
                    classNames={{
                      circle1: "border-b-[black]",
                      circle2: "border-b-[black]",
                    }}
                  />
                )}
                Submit
              </button>
              <button
                className="rounded-xl border-1 border-danger-500 px-2 text-danger-500"
                onClick={() => {
                  setSubname(user.subname!.replace(/@/g, ""));
                  setDescription(user.description);
                  setName(user.name);
                  setImage(user.image);
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </motion.div>
        <Image
          className="mr-3 max-h-[50px] max-w-[50px] rounded-full object-cover"
          src={`${image}`}
          width={50}
          height={50}
          alt="user image"
        />
        <UploadAvatar
          onImageLoaded={(imgSrc) => {
            setImage(imgSrc);
            showSuccess("Avatar uploaded successfully!");
          }}
        />
        <button
          className={`text-danger-500 transition-opacity ${user.image === image ? "opacity-45" : "opacity-100"}`}
          onClick={() => setImage(user.image)}
          disabled={user.image === image}
        >
          Remove
        </button>
      </div>

      <div className="mb-4">
        <div className="text-[#757575]">Theme:</div>

        <div
          className="max-w-max cursor-pointer items-center rounded px-3 py-1 light light:hidden light:bg-[#DCDCDC94] dark:flex dark:bg-[#2d2d2d]"
          onClick={handleThemeSwitch}
        >
          <p className="mr-2 light light:text-black dark:text-white">Dark</p>
          <div className="h-2 w-2 rounded-full bg-black" />
        </div>

        <div
          className="max-w-max cursor-pointer items-center rounded px-3 py-1 light light:flex light:bg-[#DCDCDC94] dark:hidden dark:bg-[#2d2d2d]"
          onClick={handleThemeSwitch}
        >
          <p className="mr-2 light light:text-black dark:text-white">Light</p>
          <div className="h-2 w-2 rounded-full bg-[#cacaca]" />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[#757575]">Name:</div>
        <input
          className="rounded px-2 py-1 outline-none light light:bg-[#DCDCDC94] light:text-[#2c2c2c] dark:bg-[#2d2d2d] dark:text-white"
          maxLength={30}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div className="mb-4">
        <div className="text-[#757575]">Subname:</div>
        <div className="rounded px-2 py-1 outline-none light light:bg-[#DCDCDC94] dark:bg-[#2d2d2d]">
          <span className="text-gray-500">@</span>
          <input
            className="rounded bg-transparent px-2 py-1 outline-none light light:text-[#2c2c2c] dark:text-white"
            maxLength={30}
            value={subname}
            onChange={(e) => {
              setSubname(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[#757575]">Email:</div>
        <p className="mb-4 flex max-w-80 justify-between light light:text-black dark:text-white">
          {user.email}
        </p>
      </div>

      <div className="mb-2">
        <p className="mb-1 text-[#757575]">Short bio:</p>
        <textarea
          className="w-full resize-none px-3 py-2 font-comfortaa outline-none light light:bg-[#DCDCDC94] light:text-[#2c2c2c] dark:bg-[#2d2d2d] dark:text-white"
          rows={7}
          maxLength={160}
          value={description}
          autoCorrect="on"
          autoCapitalize="off"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>
  );
}
