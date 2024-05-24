import { Button } from "@nextui-org/button";
import type { Editor } from "@tiptap/react";
import { LuCode2 } from "react-icons/lu";
import { MdOutlineFormatBold } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa";
import { GoListUnordered } from "react-icons/go";
import { BsListNested } from "react-icons/bs";
import { MdUndo } from "react-icons/md";
import { MdRedo } from "react-icons/md";

interface props {
  editor: Editor | null;
}

export default function Toolbar({ editor }: props) {
  if (!editor) {
    return null;
  }

  return (
    <div className=" mb-6 flex flex-wrap gap-5 rounded-3xl border-1 p-4 light light:border-gray-400 dark:border-[#868b9366]">
      <div className=" flex gap-2">
        <Button
          size="sm"
          color="primary"
          variant="solid"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? " bg-gray-700" : ""}
        >
          <MdOutlineFormatBold size={20} />
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="solid"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? " bg-gray-700" : ""}
        >
          <LuCode2 size={20} />
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="solid"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? " bg-gray-700" : ""}
        >
          <FaQuoteLeft size={20} />
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="solid"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? " bg-gray-700" : ""}
        >
          <GoListUnordered size={20} />
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="ghost"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          disabled={!editor.can().sinkListItem("listItem")}
          className={editor.can().sinkListItem("listItem") ? "block" : "hidden"}
        >
          <BsListNested size={20} />
        </Button>
      </div>
      <div className=" flex gap-2">
        <Button
          size="sm"
          color="primary"
          variant="bordered"
          onClick={() => editor.commands.undo()}
          disabled={!editor.can().undo()}
          className={
            editor.can().undo()
              ? " opacity-100"
              : " opacity-30 hover:!opacity-30"
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
              ? " opacity-100"
              : " opacity-30 hover:!opacity-30"
          }
        >
          <MdRedo size={20} />
        </Button>
      </div>
    </div>
  );
}
