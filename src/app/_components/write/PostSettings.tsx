// next ui / components
import Image from "next/image";

// hooks
import { useSession } from "next-auth/react";

// icons
import { FaComment, FaHeart } from "react-icons/fa";

interface PostSettingsProps {
  title: string;
  onInputChange: (title: string) => void;
}

export default function PostSettings({
  title,
  onInputChange,
}: PostSettingsProps) {
  const session = useSession();

  return (
    <div className="white:text-black flex grow-[1] p-2 dark:text-white max-[915px]:mb-4">
      <div className="mr-10 grow-[1] max-[811px]:mb-8">
        <div className="mb-6">
          <p className="mb-8 text-xl font-medium">Story perview</p>
          <div className="mb-4 min-w-full max-w-[510px] cursor-not-allowed p-8 shadow-xl light light:bg-[#f3f3f3] dark:bg-[#2a2a2a]">
            <div className="mb-3 flex items-center">
              <Image
                src={`${session.data?.user.image}`}
                width={20}
                height={20}
                alt="user picture"
                className="mr-2 rounded-full"
              />
              <div className="font-montserrat text-sm">
                {session.data?.user.name}
              </div>
            </div>

            <div className="mb-3 text-wrap break-words font-comfortaa text-2xl font-bold">
              {title || "Your title will show here"}
            </div>

            <div className="flex items-center">
              <div className="mr-3">
                <FaHeart
                  size={16}
                  className="mr-1 inline-block text-[#6b6b6b]"
                />
                0
              </div>
              <div>
                <FaComment
                  size={16}
                  className="mr-1 inline-block text-[#6b6b6b]"
                />
                0
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xl font-medium">Title</p>
          <div
            className="contrast-50"
            style={{
              color: `rgb(${title.length * 2.55} 0, 0)`,
            }}
          >
            {title.length} / 100
          </div>
          <input
            className="border-b-1 bg-transparent py-2 outline-none light light:border-[black] dark:border-[#696969]"
            value={title.trimStart()}
            maxLength={100}
            placeholder="Add title"
            onChange={(e) => onInputChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
