"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Tolbar";
import { Button } from "@nextui-org/button";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { addPostSchema } from "~/types/types";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/input";
import { useState } from "react";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>My first Post! 🔥</p>",
  });
  const [title, setTitle] = useState("My Post title");

  const router = useRouter();

  const createPost = api.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Seccess!");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!editor) {
    return null;
  }

  function handleClick() {
    try {
      addPostSchema.parse({ content: editor?.getHTML(), title });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0]!.message);
      } else {
        throw new Error(String(error));
      }
    }
    createPost.mutate({ title, content: editor!.getJSON() });
  }

  return (
    <>
      <Toolbar editor={editor} />
      <Textarea
        minRows={1}
        maxRows={4}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className=" mb-3"
        color="secondary"
        classNames={{
          input: "text-2xl font-bold",
        }}
      ></Textarea>
      <div className=" mb-1 rounded-3xl border-1 p-2 light light:border-gray-400 dark:border-[#868b9366]">
        <EditorContent editor={editor} />
      </div>
      <Button
        onClick={() => handleClick()}
        color="success"
        variant="shadow"
        className={
          editor.getText().length < 10
            ? " opacity-30 transition-opacity hover:!opacity-30"
            : " opacity-100"
        }
        disabled={editor.getText().length < 10}
      >
        Add Post
      </Button>
    </>
  );
}
