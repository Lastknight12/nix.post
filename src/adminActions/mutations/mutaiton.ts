import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export const updatePost = (success: string, error: string) => {
  return api.admin.updateSinglePost.useMutation({
    onSuccess: () => {
      toast.success(success);
    },
    onError: () => {
      toast.error(error);
    },
  });
};

export const updateUser = (success: string, error: string) => {
  return api.admin.updateSingleUser.useMutation({
    onSuccess: () => {
      toast.success(success);
    },
    onError: () => {
      toast.error(error);
    },
  });
};
