import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import Link from "next/link";

interface post {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    createdBy: {
      name: string;
    };
  };
}

export default function Post({ post }: post) {
  return (
    <Card className="max-w-[400px] bg-[#85858532]">
      <CardHeader className="flex">
          <p className="text-md text-[#ffffffc2]">{post.title}</p>
      </CardHeader>
      <CardBody className="py-0">
        <p className=" text-gray-400">{post.content}</p>
      </CardBody>
      <CardFooter>
        <Link
          href={"/post/" + post.id}
          className=" text-blue-500"
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
}
