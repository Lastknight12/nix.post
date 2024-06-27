import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  memo,
  useCallback,
} from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/trpc/react";
import { showError } from "~/utils/utils";

interface PostSettingsProps {
  tags: { id: number; displayName: string }[];
  setTags: Dispatch<
    SetStateAction<
      {
        id: number;
        displayName: string;
      }[]
    >
  >;
}

export default memo(function ReaderInterests({
  tags,
  setTags,
}: PostSettingsProps) {
  const [inputTagName, setInputTagName] = useState("");
  const debouncedInputTagName = useDebounce(inputTagName, 500);
  const [findedTags, setFindedTags] = useState<
    { id: number; displayName: string; _count: { posts: number } }[]
  >([]);

  const findTagsQuery = api.post.getAllTags.useQuery({
    startWith: debouncedInputTagName,
  });

  useEffect(() => {
    if (debouncedInputTagName.length > 0) {
      setFindedTags(findTagsQuery.data ?? []);
    }
  }, [debouncedInputTagName, findTagsQuery.data]);

  const handleAddTag = useCallback(
    (id: number, displayName: string) => {
      const filteredTags = tags.filter(
        (tag) => tag.displayName === displayName,
      );

      if (filteredTags.length === 0 && tags.length < 5) {
        setTags((prevTags) => [
          ...prevTags,
          { id: prevTags.length + 1, displayName },
        ]);
      } else {
        showError("Tag already exists");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tags],
  );

  const handleDeleteTag = useCallback(
    (id: number) =>
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const normalizedInputTagName = inputTagName.trim().replace(/\s+/g, " ");

    const tagExists = tags.some(
      (tag) => tag.displayName === normalizedInputTagName,
    );

    if (
      e.key === "Enter" &&
      normalizedInputTagName.length > 0 &&
      /^[a-zA-Z0-9\s-]+$/.test(normalizedInputTagName) &&
      !tagExists &&
      tags.length < 5
    ) {
      setTags((prevTags) => [
        ...prevTags,
        { id: prevTags.length + 1, displayName: normalizedInputTagName },
      ]);
      setInputTagName("");
    } else if (
      e.key === "Enter" &&
      !/^[a-zA-Z0-9\s-]+$/.test(normalizedInputTagName) &&
      normalizedInputTagName.length > 0
    ) {
      showError(
        "Unallowed characters. Only letters, numbers, spaces and dashes are allowed",
      );
    } else if (
      e.key === "Enter" &&
      normalizedInputTagName.length > 0 &&
      tagExists
    ) {
      showError("Tag already exists");
    }
  };

  return (
    <div className="dark:text-white max-sm:pt-4">
      <p className="mb-1 text-xl font-medium">Reader Interest</p>
      <div className="relative">
        <p className="mb-4 max-w-96">
          Add topics (up to 5) so readers know what your story is about.
        </p>
        <div
          className={`mb-7 flex flex-wrap gap-y-2 rounded-xl ${
            tags.length < 1 ? "hidden" : ""
          }`}
        >
          {tags.map(({ id, displayName }) => (
            <div
              className="mr-1 flex items-center rounded-full border-2 px-3 py-1 text-black shadow-lg dark:bg-slate-50"
              key={id}
            >
              <p className="mr-2">{displayName}</p>
              <button onClick={() => handleDeleteTag(id)}>
                <IoIosCloseCircleOutline
                  size={20}
                  className="transition-colors hover:text-red-500"
                />
              </button>
            </div>
          ))}
        </div>
        <input
          disabled={tags.length === 5}
          className="mb-2 border-b-1 border-[#696969] bg-transparent pb-3 outline-none"
          placeholder="Search or add topic"
          value={inputTagName}
          maxLength={15}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputTagName(e.target.value.trim().toLowerCase())}
        />
        <div
          style={{ display: findedTags.length > 0 ? "block" : "none" }}
          className="absolute -top-[100px] flex max-h-[150px] min-h-[150px] w-[calc(100%-0.5rem)] flex-col overflow-y-scroll rounded-md backdrop-blur-md light light:bg-[#43434347] dark:bg-[#43434373]"
        >
          {findedTags.map(({ id, displayName, _count }) => (
            <button
              className="flex w-full items-center justify-between p-2 px-3 py-2 text-start text-lg transition-colors light light:hover:bg-[#43434347] dark:hover:bg-[#66666680]"
              key={id}
              onClick={() => handleAddTag(id, displayName)}
              disabled={tags.length === 5}
            >
              {displayName}
              <span className="font-montserrat text-base font-semibold">
                {_count.posts > 1000 ? `${_count.posts / 1000}k` : _count.posts}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
