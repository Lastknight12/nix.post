import { Input } from "@nextui-org/input";
import { truncateString } from "~/utils/utils";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: Date | null;
  image: string;
}

interface props {
  post?: Post;
  user?: User;
  type: "post" | "user";
}

export default function Column({ post, user, type }: props) {
  return (
    <tr>
      {type == "post" ? (
        <>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            <Input
              value={post!.id.toString()}
              onChange={(e) => {
                e.target.value = e.target.value;
              }}
            >
              {post!.id}
            </Input>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            <Input value={post!.title}></Input>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            <Input value={truncateString(40, post!.content)}></Input>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            <Input value={post!.createdAt.toLocaleDateString()}></Input>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            <Input value={post!.updatedAt.toLocaleDateString()}></Input>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            <Input value={post!.createdBy.name}></Input>
          </td>
        </>
      ) : (
        <>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            {user!.id}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            {user!.name}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            {user!.email}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            {user!.image}
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
            {user!.role}
          </td>
        </>
      )}
    </tr>
  );
}
