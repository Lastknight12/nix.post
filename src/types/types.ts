import type { Prisma } from "@prisma/client";
import type { Session } from "next-auth";
import type { ColDef } from "ag-grid-community";

// TODO describe types and sort imports in components

// MAIN

export interface Post {
  id: number;
  publicId: string;
  perviewSrc: string | null;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: Date;
  likes: number;
  tags: JsonValue[];
  createdBy: {
    name: string;
    image: string;
  };
}

export interface PostWithComments {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  createdAt: Date;
  createdBy: {
    name: string;
    image: string;
  };
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    author: {
      name: string;
      image: string;
    };
  }[];
}

export interface MainPostsSkeleton {
  isFetched: boolean;
}

//

// DROPDOWN

export interface ModalLogout {
  isOpen: boolean | undefined;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
}

export interface MainDropDown {
  userName: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
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

type BurgerItems = {
  name: string;
  href?: string;
  type: "link" | "admin";
};

export type Burger = BurgerItems[];

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

export interface Comment {
  postId: number;
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

export interface img {
  type: "image";
  attrs: {
    alt: string;
    src: string;
    title: string;
  };
}

export type Node =
  | TextNode
  | ParagraphNode
  | BlockquoteNode
  | DocumentNode
  | CodeNode
  | orderedList
  | listItem
  | img;

export type ColDefHelper<T> = ColDef<T>[];
