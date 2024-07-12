"use client";

// editor / components / extensions
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from '@tiptap/extension-highlight'
import PushModal from "./PushModal";

// components
import Toolbar from "./Tolbar";

// hooks
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Spinner } from "@nextui-org/react";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [
      CharacterCount,
      StarterKit,
      Highlight,
      Image,
      Placeholder.configure({ placeholder: "Tell your story" }),
    ],
  });
  const [title, setTitle] = useState("");

  if (!editor) {
    return (
      <div className="flex h-[calc(100vh-116px)] w-full items-center justify-center">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toolbar editor={editor} />
      <PushModal
        editor={editor}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        charsCount={editor.storage.characterCount.characters() as number}
        title={title}
        handleInputChange={(inputTitle) => setTitle(inputTitle)}
      />
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title.trimStart()}
        color="secondary"
        maxLength={100}
        placeholder="Title"
        className="w-full mb-1 bg-transparent py-3 font-comfortaa text-[36px] outline-none light light:text-defaultLight light:placeholder:text-defaultLight dark:text-defaultDark dark:placeholder:text-defaultDark"
      ></input>
      <div className=" mb-10 rounded-3xl font-comfortaa light">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
