"use client";

// next ui / components
import { Button } from "@nextui-org/button";
import NextImage from "next/image";

// icons
import { LuCode2 } from "react-icons/lu";
import { GoListUnordered } from "react-icons/go";
import { BsListNested } from "react-icons/bs";
import { FaQuoteLeft } from "react-icons/fa";
import { MdOutlineFormatBold, MdUndo, MdRedo } from "react-icons/md";
// hooks / react types
import { useEffect, useRef, type ChangeEvent } from "react";

// tiptap types
import type { Editor } from "@tiptap/react";

// trpc api caller
import { api } from "~/trpc/react";

// utils
import { showLoadingPromise } from "~/utils/utils";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const imageLoadResolver = useRef<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }>({
    resolve: () => {
      return;
    },
    reject: () => {
      return;
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageMutation = api.image.uploadImage.useMutation({
    onError: () => imageLoadResolver.current.reject(),
  });

  useEffect(() => {
    if (imageMutation.data && editor) {
      const newSrc = `https://iuqipxloifipusrsorab.supabase.co/storage/v1/object/public/image/${imageMutation.data}`;
      const image = new Image();
      image.src = newSrc;
      image.onload = () => {
        editor?.commands.setImage({ src: newSrc });
        editor?.commands.createParagraphNear();
        editor?.chain().focus().createParagraphNear();

        imageLoadResolver.current.resolve();
      };
      image.onerror = () => {
        imageLoadResolver.current.reject();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageMutation.data]);

  if (!editor) {
    return null;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;

        const imageLoadPromise = new Promise((resolve, reject) => {
          imageLoadResolver.current.resolve = resolve;
          imageLoadResolver.current.reject = reject;
        });

        imageMutation.mutate({
          imageFile: {
            file: fileContent,
            type: "postsImages",
          },
        });

        void showLoadingPromise({
          promise: imageLoadPromise,
          successMsg: "Image uploaded successfully :D",
          loadingMsg: (
            <div className="flex items-center gap-2">
              <NextImage
                width={28}
                height={28}
                alt="image small size"
                src={fileContent}
              />
              Loading...
            </div>
          ),
          errorMsg: "Error when uploading image! Please try again later",
          toastOptions: { position: "top-right" },
        });
      };

      reader.readAsDataURL(file);

      event.target.value = "";
    }
  };

  return (
    <div className="sticky top-16 z-[1] mb-6 w-full rounded-xl border-1 bg-transparent p-4 backdrop-blur-lg light:border-gray-400 dark:border-[#868b9366]">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 max-[696px]:justify-center max-[696px]:gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`rounded-md px-3 py-1 light light:bg-lightButton dark:bg-darkButton ${editor.isActive("bold") && "bg-[#4e4e4e]"}`}
            >
              <MdOutlineFormatBold size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`rounded-md px-3 py-1 light light:bg-lightButton dark:bg-darkButton ${editor.isActive("codeBlock") && "bg-[#4e4e4e]"}`}
            >
              <LuCode2 size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`rounded-md px-3 py-1 light light:bg-lightButton dark:bg-darkButton ${editor.isActive("blockquote") && "bg-[#4e4e4e]"}`}
            >
              <FaQuoteLeft size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`rounded-md px-3 py-1 light light:bg-[#848484] dark:bg-[#353535] ${editor.isActive("orderedList") && "bg-[#4e4e4e]"}`}
            >
              <GoListUnordered size={20} />
            </button>
            <Button
              onClick={() =>
                editor.chain().focus().sinkListItem("listItem").run()
              }
              disabled={!editor.can().sinkListItem("listItem")}
              className={`${editor.can().sinkListItem("listItem") ? "block" : "hidden"}`}
            >
              <BsListNested size={20} />
            </Button>
          </div>

          <div className="mx-auto flex items-center gap-2">
            <button
              className={`rounded-md px-3 py-1 light light:bg-lightButton dark:bg-darkButton ${editor.isActive("bold") && "bg-[#4e4e4e]"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Image
            </button>
            <button
              onClick={() => editor.commands.undo()}
              disabled={!editor.can().undo()}
              className={` ${
                editor.can().undo()
                  ? "opacity-100"
                  : "opacity-30 hover:!opacity-30"
              } rounded-md bg-primary-500 px-3 py-1 transition-opacity`}
            >
              <MdUndo size={20} />
            </button>
            <button
              onClick={() => editor.commands.redo()}
              disabled={!editor.can().redo()}
              className={` ${
                editor.can().redo()
                  ? "opacity-100"
                  : "opacity-30 hover:!opacity-30"
              } rounded-md bg-primary-500 px-3 py-1 transition-opacity`}
            >
              <MdRedo size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
        />
      </div>
    </div>
  );
}
