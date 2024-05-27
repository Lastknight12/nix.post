/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma } from "@prisma/client";
import type { Session } from "next-auth";
import type { ColDef } from "ag-grid-community";
import { z } from "zod";

export const addPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(20, "max title lenght 20"),
  content: z.string().min(10, "content must be at least 10 characters"),
});

export const addCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

// MAIN

export interface MainPostProps {
  post: {
    id: number;
    title: string;
    content: any;
    createdAt: Date;
    createdBy: {
      name: string;
      image: string;
    };
  };
}

export interface MainPostsSkeleton {
  isFetched: boolean;
}

//

// MODAL

export interface ModalLogout {
  isOpen: boolean | undefined;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
}

//

// NAVBAR

export interface NavNavbar {
  session: Session | null;
}

export interface NavUser {
  session: Session | null;
}

export interface UserInfo {
  session: Session | null;
}

//

// ADMIN DASHBOARD

export interface AdminPosts {
  id: number;
  title: string;
  content: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string;
  };
}

export interface AdminUsers {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  emailVerified: Date | null;
  image: string;
}

//

export interface SinglePost {
  params: {
    id: string;
  };
}

export interface Comment {
  postId: string;
  post: {
    comments: {
      content: string;
      id: number;
      createdAt: Date;
      author: {
        name: string;
        image: string;
      };
    }[];
    title: string;
    content: Prisma.JsonValue;
    createdBy: {
      name: string;
      image: string;
    };
  };
}

// PROFILE
export interface Profile {
  params: {
    name: string;
  };
}

export interface ProfileUser {
  user: {
    id: string;
    name: string;
    image: string;
    description: string | null;
  } | null;
  session: Session | null;
}
//

export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null
  | Node;

export interface TextNode {
  type: "text";
  text: string;
}

export interface ParagraphNode {
  type: "paragraph";
  content?: Array<Node>;
}

export interface BlockquoteNode {
  type: "blockquote";
  content?: Array<Node>;
}

export interface DocumentNode {
  type: "doc";
  content: Array<Node>;
}

export interface CodeNode {
  type: "codeBlock";
  attrs: {
    language: string | null;
  };
  content: Array<TextNode>;
}

export interface listItem {
  type: "listItem";
  content: Array<Node>;
}

export interface orderedList {
  type: "orderedList";
  attrs: {
    start: number;
  };
  content: Array<Node>;
}

export type Node =
  | TextNode
  | ParagraphNode
  | BlockquoteNode
  | DocumentNode
  | CodeNode
  | orderedList
  | listItem;

export type ColDefHelper<T> = ColDef<T>[];
