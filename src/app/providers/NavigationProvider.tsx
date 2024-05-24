import { getServerAuthSession } from "~/server/auth";
import Navigation from "../_components/navbar/Navbar";

export async function NavigationProvider() {
  const session = await getServerAuthSession();

  return <Navigation session={session} />;
}
