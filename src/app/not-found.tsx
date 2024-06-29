import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative h-[calc(100vh-116px)] w-full">
      <div className="pointer-events-none absolute left-0 top-0 -z-[1] flex h-full w-full items-center justify-center text-[290px] light light:text-[#f3f3f3] dark:text-[#212121] max-sm:text-[190px] max-[345px]:text-[165px]">
        404
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center light light:text-black dark:text-white">
        <h2>Page Not Found</h2>
        <p className="mb-3">Could not find requested resource</p>
        <Link href="/" className="rounded-lg bg-secondary-500 p-3 text-white">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
