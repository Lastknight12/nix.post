import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import Image from "next/image";
import ScrollAnimation from "~/app/_components/animation/scrollAnimation";
import Comments from "~/app/_components/posts/addComment";

interface requestId {
  params: {
    id: string;
  };
  searchParams: string;
}

export default async function PostInfo(req: requestId) {
  const post = await api.post.getIndividualPost({ id: req.params.id });

  if (!post) {
    return notFound();
  }

  return (
    <>
      <ScrollAnimation />
      <div className="mt-4 w-full border-b-1 border-gray-500 py-6 px-2">
        <div className=" mx-auto max-w-[1000px]">
          <div className=" flex items-center gap-2">
            <Image
              src={post.createdBy.image}
              alt="Post creator avatar"
              className=" rounded-full"
              width={50}
              height={50}
            />
            <p className=" text-xl">{post.createdBy.name}</p>
          </div>
        </div>
      </div>
      <div className=" mb-4 border-b-1 border-gray-500 p-4 pb-10 max-md:bg-[#48494a3b]">
        <p className=" mb-3 text-center text-4xl">{post.title}</p>
        <div className="flex items-center justify-center">
          <div className=" max-w-[1024px]">
            <div className=" fex gap-7">
              <pre className=" text-xl text-gray-400 text-wrap font-[inherit]">{post.content}</pre>
            </div>
          </div>
        </div>
      </div>
      <Comments postId={req.params.id} post={post} />
    </>
  );
}
