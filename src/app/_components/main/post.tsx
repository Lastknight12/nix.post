import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import Link from "next/link";
import Image from "next/image";

interface post {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    createdBy: {
      name: string;
      image: string
    };
  };
}

export default function Post({ post }: post) {

  function truncateString(maxLength: number, str: string): string {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.slice(0, maxLength) + "....";
    }
  }

  return (
    <Card className="max-w-[400px] bg-[#85858532]">
      <CardHeader className=" flex flex-col gap-3">
        <div className=" flex gap-2">
        <Image src={post.createdBy.image} alt="User profile picture" width={30} height={30} className=" rounded-full mb-1"/>
        <h1 className=" text-[#ffffffa2]">{post.createdBy.name}</h1>
        </div>
        <p className=" text-3xl text-[#ffffffc2]"> post.title</p>
      </CardHeader>
      <CardBody className="py-0">
        <p className=" text-gray-400 mb-2">{truncateString(120, post.content)}</p>
        <p className=" text-[#808080a8] text-sm">{post.createdAt.toLocaleString()}</p>
      </CardBody>
      <CardFooter>
        <Link href={"/post/" + post.id} className=" text-blue-500 mx-auto">
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
}
