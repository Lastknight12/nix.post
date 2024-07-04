// components
import { notFound } from "next/navigation";
import EditSettings from "../_components/settings/Settings";

// auth
import { getServerAuthSession } from "~/server/auth";

export default async function Settings() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return notFound();
  }

  const { name, email, image, subname, description, id, role, likedPosts } =
    session.user;

  const user = {
    id,
    name: name!,
    email: email!,
    image: image!,
    subname,
    description,
    role,
    likedPosts,
  };

  return <EditSettings user={user} />;
}
