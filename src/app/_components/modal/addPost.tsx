import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import toast, { Toaster } from "react-hot-toast";
import { Input, Textarea } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { ZodError, z } from "zod";
import { addPostSchema } from "../../types/types";

interface props {
  isOpen: boolean | undefined;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onOpenChange, onClose }: props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = api.post.createPost.useMutation({
    onSuccess: () => {
      setTitle("");
      setContent("");
      onClose();
      router.refresh();
    },
  });

  const handleSubmit = () => {
    try {
      addPostSchema.parse({ title, content });
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.map((error) => toast.error(error.message));
      } else {
        throw new Error(String(error));
      }
    }
    createPost.mutate({ title, content });
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <>
            <ModalBody>
              <Input
                type="text"
                label="title (min 5 characters)"
                size="md"
                value={title}
                classNames={{
                  input: "!text-white",
                  label: "!text-gray-500",
                  inputWrapper: "border-[#ffffff9e] hover:border-[#ffffff9e]",
                }}
                variant="underlined"
                color="secondary"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Enter your description (min 20)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                classNames={{
                  inputWrapper:
                    " bg-transparent text-white border-[#ffffff9e] hover:border-[#ffffff9e]",
                }}
                color="secondary"
                variant="underlined"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                variant="shadow"
                color="success"
                onClick={handleSubmit}
                disabled={createPost.isPending}
                isLoading={createPost.isPending}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
        <Toaster />
      </Modal>
    </div>
  );
}
