// components
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import SubmitButton from "./SubmitButton";
import PostSettings from "./PostSettings";

// hooks
import { useState } from "react";
import { useDisclosure } from "@nextui-org/react";

// tiptap types
import type { Editor } from "@tiptap/react";
import ReaderInterests from "./ReaderInterests";
import PostPerview from "./PostPerview";

interface PushModalProps {
  editor: Editor;
  charsCount: number;
  title: string;
  handleInputChange: (title: string) => void;
}

export default function PushModal({
  editor,
  charsCount,
  title,
  handleInputChange,
}: PushModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [tags, setTags] = useState<{ id: number; displayName: string }[]>([]);

  const [perviewSrc, setPerviewSrc] = useState<string>("");

  function handleAddTag(tagName: string) {
    setTags((prevTags) => [
      ...prevTags,
      {
        id: prevTags.length + 1,
        displayName: tagName,
      },
    ]);
  }

  function handleRemoveTag(id: number) {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  }

  return (
    <div className="flex justify-end">
      <Button
        onClick={() => onOpen()}
        color="success"
        className={
          charsCount < 35
            ? "opacity-30 transition-opacity hover:!opacity-30"
            : "opacity-100"
        }
        disabled={charsCount < 35}
      >
        Push
      </Button>
      <Modal
        classNames={{
          closeButton: "",
        }}
        className="light light:bg-content1 dark:bg-[#222222]"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 light light:text-black dark:text-white">
                Publish Post
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-wrap justify-between p-2 text-black max-sm:border-b-1 max-sm:border-[#eeeeee]">
                  <PostSettings
                    title={title}
                    onInputChange={(inputTitle) =>
                      handleInputChange(inputTitle)
                    }
                  />
                  <div className="flex flex-col max-[915px]:w-full">
                    <PostPerview
                      perviewSrc={perviewSrc}
                      onImageLoaded={(data) => setPerviewSrc(data as string)}
                    />
                    <ReaderInterests
                      tags={tags}
                      onTagAdd={handleAddTag}
                      onTagDelete={handleRemoveTag}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>

                <SubmitButton
                  editor={editor}
                  title={title.trim()}
                  tags={tags}
                  perviewSrc={perviewSrc}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
