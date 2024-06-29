import Link from "next/link";
import Image from "next/image";
import type { JsonValue } from "~/types/types";
import Comments from "../comments/Comments";
import { notFound } from "next/navigation";
import {
  calcReadTime,
  getDayAndMonth,
  isValidNode,
  parseTiptapJsonToHtml,
} from "~/utils/utils";
import { api } from "~/trpc/server";
import Navbar from "./Navbar";
import { getServerAuthSession } from "~/server/auth";

export default async function SinglePost({
  postPublicId,
}: {
  postPublicId: string;
}) {
  const post = await api.post.getIndividualPost({
    publicId: postPublicId,
  });

  if (!post) {
    return notFound();
  }

  const content = post.content as JsonValue;
  const parsedHtml = isValidNode(content) ? parseTiptapJsonToHtml(content) : "";

  const readTime = calcReadTime(parsedHtml);

  const session = await getServerAuthSession();
  return (
    <div className="max-w-[1080px] text-black">
      <div className="mb-6">
        <h1 className="font-arvo break-words text-4xl font-bold light light:text-defaultLight dark:text-defaultDark">
          {post.title}
        </h1>
      </div>

      <div>
        <Link href={`/profile/${post.createdBy.name}`}>
          <div className="flex items-center gap-3">
            <div>
              <Image
                src={post.createdBy.image}
                width={40}
                height={40}
                alt="post author image"
                className="rounded-full"
              />
            </div>

            <div>
              <div className="text-lg light light:text-defaultLight dark:text-defaultDark">
                {post.createdBy.name}
              </div>

              <div className="flex gap-2 text-sm text-[#6B6B6B]">
                {readTime} to read ~ {getDayAndMonth(post.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-10 flex gap-2">
        {post.tags.map((tag) => (
          <Link
            href={`/tags/${tag.displayName}`}
            key={tag.id}
            className="light light:text-black dark:text-white"
          >
            #{tag.displayName}
          </Link>
        ))}
      </div>

      <Navbar postId={post.id} loggedIn={session?.user ? true : false} />

      <div className="mb-6 mt-10">
        <div
          dangerouslySetInnerHTML={{ __html: parsedHtml }}
          className="tiptap"
        ></div>
      </div>
      <Comments postId={post.id} />
    </div>
  );
}
