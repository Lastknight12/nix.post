import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export const updatePost = (success: string, error: string) => {
  return api.post.updateSinglePost.useMutation({
    onSuccess: () => {
      toast.success(success);
    },
    onError: () => {
      toast.error(error);
    },
  });
};

export const updateUser = (success: string, error: string) => {
  return api.post.updateSingleUser.useMutation({
    onSuccess: () => {
      toast.success(success);
    },
    onError: () => {
      toast.error(error);
    },
  });
};

export const addPost = (successFn: () => Promise<void>) => {
  return api.post.createPost.useMutation({
    onSuccess: async () => {
      await successFn();
    },
  });
};
