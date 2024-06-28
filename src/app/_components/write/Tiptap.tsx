"use client";

// editor hooks / components / extensions
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

// components
import Toolbar from "./Tolbar";

// hooks
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import PushModal from "./PushModal";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [
      CharacterCount,
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: "Tell your story" }),
    ],
  });
  const [title, setTitle] = useState("");

  if (!editor) {
    return null;
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
        className="w-full bg-transparent p-3 font-comfortaa text-3xl outline-none light light:text-defaultLight light:placeholder:text-defaultLight dark:text-defaultDark dark:placeholder:text-defaultDark"
      ></input>
      <div className="mb-1 rounded-3xl font-comfortaa light">
        {!editor ? (
          <Spinner className="mx-auto" />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </>
  );
}
