"use client";

import { Button, Textarea } from "@nextui-org/react";
import Image from "next/image";
import { useState, useEffect, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { RiEditFill } from "react-icons/ri";
import type { Session } from "next-auth";

interface ProfileUserProps {
  user: {
    id: string;
    name: string;
    image: string;
    description: string | null;
  } | null;
  session: Session | null;
}

export function UserDescription({ user, session }: ProfileUserProps) {
  const [description, setDescription] = useState(user?.description ?? "No Bio");
  const [changed, setChanged] = useState(false);
  const updateDescription = api.post.updateUserDescription.useMutation({
    onSuccess: () => {
      toast.success("Success");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (user?.description) {
      setDescription(user.description);
    }
  }, [user?.description]);

  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDescription(e.target.value);
    setChanged(true);
  };

  const onDescriptionUpdate = () => {
    updateDescription.mutate({
      userId: session!.user.id,
      description: description.toString(),
    });
  };

  return (
    <div className="sticky top-20">
      <Image
        src={user!.image}
        width={65}
        height={65}
        alt="user avatar"
        className="mb-2 rounded-full"
      />
      <h1 className="mb-3 text-xl font-semibold dark:text-white">
        {user?.name}
      </h1>
      {session?.user.id === user?.id ? (
        <>
          <Textarea
            value={description}
            color="secondary"
            minRows={1}
            onChange={(e) => onChangeDescription(e)}
            endContent={<RiEditFill size={25} />}
            classNames={{
              inputWrapper: "mb-2",
              input: "text-2xl",
            }}
          />
          <Button
            className={`${!changed || (updateDescription.isSuccess && "hidden")}`}
            color="success"
            isLoading={updateDescription.isPending}
            onClick={() => onDescriptionUpdate()}
          >
            Save
          </Button>
        </>
      ) : (
        <p className="text-2xl dark:text-white">
          {user?.description ? user.description : "No Bio"}
        </p>
      )}
    </div>
  );
}
