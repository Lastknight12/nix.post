// next ui / components
import { Button } from "@nextui-org/react";
import type { Editor } from "@tiptap/react";

// toast
import { showError } from "~/utils/utils";

// types / Schemas
import { addPostSchema } from "~/types/zodSchemas";
import { ZodError } from "zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface SubmitButtonProps {
  editor: Editor;
  title: string;
  tags: { id: number; displayName: string }[];
  perviewSrc: string;
}

export default function SubmitButton({
  editor,
  title,
  tags,
  perviewSrc,
}: SubmitButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const charsCount = editor.storage.characterCount.characters();
  const roter = useRouter();
  const utils = api.useUtils();

  const createPost = api.post.createPost.useMutation({
    onSuccess: async () => {
      await utils.post.getPosts.invalidate();
      roter.push("/");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  async function handleClick() {
    try {
      addPostSchema.parse({
        content: editor.getJSON(),
        title,
        tags,
        perviewSrc,
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return showError(error.errors[0]!.message);
      }
    }
    createPost.mutate({ content: editor.getJSON(), title, tags, perviewSrc });
  }

  return (
    <Button
      onClick={() => handleClick()}
      color="success"
      variant="shadow"
      isLoading={createPost.isPending}
      className={
        createPost.isPending || charsCount < 35 || title.length < 5
          ? "opacity-30 transition-opacity hover:!opacity-30"
          : "opacity-100"
      }
      disabled={createPost.isPending || charsCount < 35 || title.length < 5}
    >
      Save
    </Button>
  );
}
