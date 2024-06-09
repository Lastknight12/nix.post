import { Button } from "@nextui-org/react";
import type { Editor } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { api } from "~/trpc/react";
import { addPostSchema } from "~/types/types";
import { showError, showLoadingPromise  } from "~/utils/utils";

export default function SubmitButton({
  editor,
  title,
  isLoading,
}: {
  editor: Editor;
  title: string;
  isLoading: boolean;
}) {
  const createPost = api.post.createPost.useMutation({});

  const router = useRouter();

  const utils = api.useUtils();

  async function handleClick() {
    try {
      addPostSchema.parse({ content: editor.getText(), title });
      const createPostPromise = new Promise<void>((resolve, reject) => {
        createPost.mutate(
          { title, content: editor.getJSON() },
          {
            onSuccess: () => resolve(),
            onError: (error) => {
              showError(`Error when creating post: ${error.message}`);
              reject();
            },
          },
        );
      });
  
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      showLoadingPromise({
        promise: createPostPromise,
        successMsg: "Success add post",
        loadingMsg: "loading...",
        errorMsg: "Error when adding post",
        action: async () => {
          router.push("/");
          await utils.post.getBatch.invalidate();
        },
        toastOptions: undefined
      });
    } catch (error) {
      if (error instanceof ZodError) {
        showError(error.errors[0]!.message);
      } else {
        showError(error as string)
      }
    }
  }  

  return (
    <Button
      onClick={() => handleClick()}
      color="success"
      variant="shadow"
      className={
        isLoading
          ? "opacity-30 transition-opacity hover:!opacity-30"
          : "opacity-100"
      }
      disabled={isLoading}
    >
      Add Post
    </Button>
  );
}
