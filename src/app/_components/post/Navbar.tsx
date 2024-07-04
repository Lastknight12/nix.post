"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { api } from "~/trpc/react";
import { parseNumber, showError } from "~/utils/utils";
import { motion } from "framer-motion";

interface NavbarProps {
  postId: number;
  loggedIn: boolean;
}

export default function Navbar({ postId, loggedIn }: NavbarProps) {
  const utils = api.useUtils();
  const {
    data: postStats,
    isLoading,
    isPending,
  } = api.post.getPostStats.useQuery({
    postId,
  });

  const [likes, setLikes] = useState(0);

  const { update } = useSession();

  const incrementLikes = api.post.incrementLike.useMutation({
    onSuccess: async () => {
      await utils.post.getPostStats.refetch({ postId });
    },
    onError: (error) => {
      setLikes((prevLikes) => prevLikes - 1);
      return showError(error.message);
    },
  });

  // i can disable button if isPendeing and in getIndividualPost check if user.likedPosts.includes(post.id) and it still work like that, but i like this solution wich looks like in medium.com :D

  const [isPostNowLiked, setIsPostNowLiked] = useState<boolean>(
    postStats?.isPostLiked ?? false,
  );

  useEffect(() => {
    setIsPostNowLiked(postStats?.isPostLiked ?? false);
    setLikes(postStats?.likes ?? 0);
  }, [postStats]);

  async function handleClick() {
    if (!loggedIn) {
      return showError("You must be logged in to like a post");
    }

    setLikes((prevLikes) => prevLikes + 1);
    setIsPostNowLiked(true);
    incrementLikes.mutate({ postId });
    await update({ likedPosts: postId });
  }

  return (
    <div className="mt-3 border-y-1 py-3 text-xs light light:border-[#f2f2f2] dark:border-[#212121]">
      <div className="flex gap-5">
        <div className="flex items-center">
          {isLoading || isPending ? (
            <div className="light light:text-black dark:text-white">--</div>
          ) : (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={handleClick}
                className="bg-transparent"
                disabled={isPostNowLiked && !loggedIn}
              >
                <FaHeart
                  className={`mr-1 text-[#6b6b6b] transition-colors hover:text-red-500 ${isPostNowLiked ? "text-red-500" : "text-[#6b6b6b]"}`}
                  size={17}
                />
              </button>
              <p className="inline-block text-base light light:text-defaultLight dark:text-defaultDark">
                {parseNumber(likes)}
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex items-center">
          <FaComment className="mr-1 text-[#6b6b6b]" size={17} />
          <p className="inline-block text-base light light:text-defaultLight dark:text-defaultDark">
            {parseNumber(postStats?.comments ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
