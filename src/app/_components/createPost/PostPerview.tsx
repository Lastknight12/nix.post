import {
  type ChangeEvent,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import { showError } from "~/utils/utils";

interface PostPerviewProps {
  perviewSrc: string;
  setPerviewSrc: Dispatch<SetStateAction<string>>;
}

export default function PostPerview({
  perviewSrc,
  setPerviewSrc,
}: PostPerviewProps) {
  const blurDataURL = useRef("");

  const uploadImagePerview = api.image.uploadImage.useMutation({
    onError: (err) => showError(err.message),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const fileContent = loadEvent.target?.result as string;
        blurDataURL.current = fileContent;

        uploadImagePerview.mutate({
          imageFile: {
            file: fileContent,
            type: "postPerviewImages",
          },
        });
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (uploadImagePerview.data) {
      setPerviewSrc(
        `https://iuqipxloifipusrsorab.supabase.co/storage/v1/object/public/image/${uploadImagePerview.data}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadImagePerview.data]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-9">
      <p className="mb-3 text-xl font-medium light light:text-black dark:text-white">
        Strory perview image
      </p>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
      />
      <button
        className={`${perviewSrc ? "block" : "hidden"}`}
        onClick={handleClick}
      >
        Edit image
      </button>
      <div className="flex h-[107px] w-[160px] flex-col items-center justify-center overflow-hidden shadow-md light light:bg-[#f3f3f3] dark:bg-[#2a2a2a]">
        {!perviewSrc || uploadImagePerview.error ? (
          <>
            <p className="mb-2 text-center light light:text-black dark:text-white">
              No image selected
            </p>
            <button
              onClick={handleClick}
              className="rounded-sm bg-primary-500 p-2 text-white"
            >
              Upload
            </button>
          </>
        ) : (
          <Image
            src={perviewSrc}
            className="relative object-contain before:absolute before:right-0 before:top-0 before:bg-black before:content-['']"
            alt="image"
            width={300}
            height={150}
            placeholder="blur"
            blurDataURL={blurDataURL.current}
          />
        )}
      </div>
    </div>
  );
}
