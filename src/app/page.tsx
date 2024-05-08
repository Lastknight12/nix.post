import { getServerAuthSession } from "~/server/auth";
import Navigation from "./_components/navbar/navbar";
import Posts from "./_components/main/allPosts";

export default async function Main() {
  const session = await getServerAuthSession();

  return (
    <>
      <Navigation session={session} />
      <Posts />
    </>
  );
}
