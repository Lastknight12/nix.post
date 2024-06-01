import Link from "next/link";
import Image from "next/image";
import type { JsonValue } from "~/types/types";
import Comments from "../comment/Comments";
import { notFound } from "next/navigation";
import { isValidNode, parseTiptapJsonToHtml } from "~/utils/utils";
import { api } from "~/trpc/server";

export default async function SinglePost({ postId }: { postId: string }) {
  const post = await api.post.getIndividualPost({
    id: +postId,
  });

  if (!post) {
    return notFound();
  }

  const content = post.content as JsonValue;
  const parsedHtml = isValidNode(content) ? parseTiptapJsonToHtml(content) : "";
  return (
    <>
      <div className="mt-4 w-full px-2 py-6">
        <div className=" mx-auto max-w-screen-lg">
          <Link href={"/profile/" + post.createdBy.name}>
            <div className=" flex items-center gap-2 rounded-xl p-3 transition-background hover:bg-[#80808039]">
              <Image
                src={post.createdBy.image}
                alt="Post creator avatar"
                className=" rounded-full"
                width={50}
                height={50}
              />
              <p className=" font-montserrat text-xl light light:text-[#383838] dark:text-[#ffffff]">
                {post.createdBy.name}
              </p>
            </div>
          </Link>
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
                dangerouslySetInnerHTML={{ __html: parsedHtml }}
              />
            </div>
          </div>
        </div>
      </div>
      <Comments postId={post.id} post={post} />
    </>
  );
}
