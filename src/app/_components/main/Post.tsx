"use client";

import Link from "next/link";
import Image from "next/image";
import type { Post as PostType } from "~/types/types";
import { memo, useEffect, useRef } from "react";
import { getDayAndMonth } from "~/utils/utils";
import { useInView } from "framer-motion";
import { FaComment } from "react-icons/fa";
import { api } from "~/trpc/react";
import { Skeleton } from "@nextui-org/react";
import { FaHeart } from "react-icons/fa6";
import { motion } from "framer-motion";

// Define the props interface for the Post component //TODO: refactor and add into new file logic with comments and likes count
interface PostProps {
  post: PostType;
  fetchNextPage?: () => void;
  fetchNextTargetId?: number;
}

export default memo(function Post({
  post,
  fetchNextPage,
  fetchNextTargetId,
}: PostProps): React.ReactElement {
  const postDate = getDayAndMonth(post.createdAt);

  const { data, isLoading, isRefetching } =
    api.post.getLikesAndCommentsCount.useQuery({
      postId: post.id,
    });

  const FetchNextRef = useRef<HTMLDivElement>(null);

  const isElementInView = useInView(FetchNextRef, { once: true });

  useEffect(() => {
    if (isElementInView && fetchNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isElementInView]);

  return (
    <motion.div
      ref={fetchNextTargetId === post.id ? FetchNextRef : null}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="cursor-pointe flex max-w-[800px] justify-center border-b-1 light light:border-[#f2f2f2] dark:border-[#212121]"
    >
      <div className="flex w-full items-center justify-between">
        <div className="w-full rounded-3xl px-5 py-10">
          <Link href={"/post/" + post.publicId}>
            <div className="mb-3 flex items-center gap-2">
              <Image
                src={post.createdBy.image}
                alt="User profile picture"
                width={25}
                height={25}
                className="rounded-full"
              />
              <h1 className="font-montserrat text-sm light light:text-[#242424] dark:text-[#ffffff]">
                {post.createdBy.name}
              </h1>
            </div>
            <p className="mb-3 max-w-[550px] break-words font-comfortaa text-2xl font-bold light light:text-defaultLight dark:text-defaultDark">
              {post.title}
            </p>
          </Link>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-[rgb(107,107,107)]">{postDate}</p>
            </div>
            {isLoading || isRefetching ? (
              <Skeleton className="h-[22px] w-[99px]" />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex"
              >
                <div className="mr-2 flex items-center gap-1">
                  <FaComment className="ml-3 light light:text-[#6b6b6b]" />
                  <p className="text-[#6b6b6b]">{data?._count.comments}</p>
                </div>
                <div className="flex items-center gap-1">
                  <FaHeart
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    className="ml-3 text-[#6b6b6b] transition-colors"
                  />
                  <p className="text-[#6b6b6b]">{post.likes}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        {post.perviewSrc && (
          <Image
            src={post.perviewSrc}
            alt="post preview image"
            className="max-h-[125px] object-contain"
            width={160}
            height={125}
          />
        )}
      </div>
    </motion.div>
  );
});
