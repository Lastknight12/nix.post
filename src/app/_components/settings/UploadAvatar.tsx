import { type ChangeEvent, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { showError } from "~/utils/utils";

interface PostPerviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImageLoaded: (imgSrc: string) => void;
}

export default function UploadAvatar({ onImageLoaded }: PostPerviewProps) {
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

        uploadImagePerview.mutate({
          imageFile: {
            file: fileContent,
            type: "userAvatar",
          },
        });
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (uploadImagePerview.data) {
      onImageLoaded(
        `https://iuqipxloifipusrsorab.supabase.co/storage/v1/object/public/image/${uploadImagePerview.data}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadImagePerview.data]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mr-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
      />
      <button onClick={handleClick} className="text-success-500">
        Upload
      </button>
    </div>
  );
}
