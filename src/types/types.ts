import type { Prisma } from "@prisma/client";
import type { ColDef } from "ag-grid-community";

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
    subname: string | null;
    image: string;
  };
}

//

// ADMIN DASHBOARD

export interface AdminPosts {
  id: number;
  title: string;
  content: Prisma.JsonValue;
  perviewSrc: string | null;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  subname: string | null;
  likes: number;
  tags: { displayName: string }[];
}

export interface AdminUsers {
  id: string;
  name: string;
  subname: string | null;
  email: string;
  description: string;
  role: "Admin" | "User";
  emailVerified: Date | null;
  image: string;
  likedPosts: number[];
}

//

export type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null
  | Node;

interface TextNode {
  type: "text";
  text: string;
  marks: { type: string }[];
}

interface ParagraphNode {
  type: "paragraph";
  content?: Array<Node>;
}

interface BlockquoteNode {
  type: "blockquote";
  content?: Array<Node>;
}

interface DocumentNode {
  type: "doc";
  content: Array<Node>;
}

interface CodeNode {
  type: "codeBlock";
  attrs: {
    language: string | null;
  };
  content: Array<TextNode>;
}

interface listItem {
  type: "listItem";
  content: Array<Node>;
}

interface orderedList {
  type: "orderedList";
  attrs: {
    start: number;
  };
  content: Array<Node>;
}

interface img {
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
