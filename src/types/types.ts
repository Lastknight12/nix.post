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
