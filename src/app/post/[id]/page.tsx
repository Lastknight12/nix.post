import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import Image from "next/image";
import Comments from "~/app/_components/comment/AddComment";
import type { SinglePost } from "~/types/types";
import { parseTiptapJsonToHtml } from "~/utils/utils"; // Убедитесь, что путь правильный
import { Spinner } from "@nextui-org/spinner";

export default async function PostInfo(req: SinglePost) {
  const post = await api.post.getIndividualPost({
    id: +req.params.id,
  });

  if (!post) {
    return notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidNode = (node: unknown): node is Node => {
    if (typeof node !== "object" || node === null || !("type" in node)) {
      return false;
    }

    const nodeType = (node as { type: string }).type;

    return (
      nodeType === "doc" ||
      nodeType === "paragraph" ||
      nodeType === "blockquote" ||
      nodeType === "text" ||
      nodeType === "codeBlock"
    );
  };

  const html = isValidNode(post.content)
    ? parseTiptapJsonToHtml(post.content)
    : "";

  return (
    <>
      <div className="mt-4 w-full px-2 py-6">
        <div className=" mx-auto max-w-screen-lg">
          <div className=" flex items-center gap-2">
            <Image
              src={post.createdBy.image}
              alt="Post creator avatar"
              className=" rounded-full"
              width={50}
              height={50}
            />
            <p className=" text-xl light light:text-[#595959] dark:text-[#ffffff]">
              {post.createdBy.name}
            </p>
          </div>
        </div>
      </div>
      <div className=" mx-auto mb-2 max-w-screen-lg p-4 pb-10 ">
        <div className="flex flex-col justify-center">
          <p className=" mb-6 text-center text-4xl font-bold light light:text-black dark:text-[#ffffffc2] dark:text-white">
            {post.title}
          </p>
          <div className=" max-w-[1024px]">
            <div className=" fex gap-7">
              <div
                className="tiptap"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </div>
      <Comments postId={req.params.id} post={post} />
    </>
  );
}
