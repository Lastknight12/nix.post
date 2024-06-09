"use client";

import { Button } from "@nextui-org/button";
import type { Editor } from "@tiptap/react";
import { LuCode2 } from "react-icons/lu";
import { MdOutlineFormatBold, MdUndo, MdRedo } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa";
import { GoListUnordered } from "react-icons/go";
import { BsListNested } from "react-icons/bs";
import { useEffect, useRef, type ChangeEvent } from "react";
import SubmitButton from "./SubmitButton";
import { api } from "~/trpc/react";
import NextImage from "next/image";
import { displayImageInEditor, showLoadingPromise } from "~/utils/utils";

interface Props {
  editor: Editor | null;
  title: string;
}

export default function Toolbar({ editor, title }: Props) {
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
    onError: () => imageLoadResolver.current.reject()
  });

  useEffect(() => {
    if (imageMutation.data && editor) {
      displayImageInEditor({
        filePath: imageMutation.data,
        editor,
        resolveFn: imageLoadResolver.current.resolve,
        rejectFn: imageLoadResolver.current.reject
      })
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
        const randomFileName = (Math.random() + 1)
          .toString(36)
          .substring(2, 30);

        const imageLoadPromise = new Promise((resolve, reject) => {
          imageLoadResolver.current.resolve = resolve;
          imageLoadResolver.current.reject = reject;
        });

        void showLoadingPromise({
          promise: imageLoadPromise,
          successMsg: "Image uploaded successfully :D",
          loadingMsg: (
            <div className="flex items-center gap-2">
              <NextImage
                width={26}
                height={26}
                alt="image small size"
                src={fileContent}
              />{" "}
              Loading...
            </div>
          ),
          errorMsg: "Error when uploading image! Please try again later",
          toastOptions: {position: "top-right"}
        });

        imageMutation.mutate({imageFile: {name: randomFileName, file: fileContent}})

      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6 rounded-3xl border-1 p-4 light:border-gray-400 dark:border-[#868b9366]">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-gray-700" : ""}
          >
            <MdOutlineFormatBold size={20} />
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "bg-gray-700" : ""}
          >
            <LuCode2 size={20} />
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-gray-700" : ""}
          >
            <FaQuoteLeft size={20} />
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-700" : ""}
          >
            <GoListUnordered size={20} />
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="ghost"
            onClick={() =>
              editor.chain().focus().sinkListItem("listItem").run()
            }
            disabled={!editor.can().sinkListItem("listItem")}
            className={
              editor.can().sinkListItem("listItem") ? "block" : "hidden"
            }
          >
            <BsListNested size={20} />
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Image
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="bordered"
            onClick={() => editor.commands.undo()}
            disabled={!editor.can().undo()}
            className={
              editor.can().undo()
                ? "opacity-100"
                : "opacity-30 hover:!opacity-30"
            }
          >
            <MdUndo size={20} />
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="bordered"
            onClick={() => editor.commands.redo()}
            disabled={!editor.can().redo()}
            className={
              editor.can().redo()
                ? "opacity-100"
                : "opacity-30 hover:!opacity-30"
            }
          >
            <MdRedo size={20} />
          </Button>
        </div>
        <SubmitButton
          editor={editor}
          title={title}
          isLoading={imageMutation.isPending}
        />
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
