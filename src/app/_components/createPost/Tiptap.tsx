"use client";

import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

import Toolbar from "./Tolbar";

import { useState } from "react";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit, Image, Placeholder.configure({placeholder: "Tell your story"})],
  });
  const [title, setTitle] = useState("");

  if (!editor) {
    return null;
  }

  return (
    <>
      <Toolbar editor={editor} title={title}/>
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        color="secondary"
        placeholder="Title"
        className="text-3xl font-semibold outline-none bg-transparent w-full p-3 text-[#000] placeholder:text-[#b3b3b1]"
      ></input>
      <div className="mb-1 rounded-3xl light">
        <EditorContent editor={editor}/>
      </div>
    </>
  );
}
