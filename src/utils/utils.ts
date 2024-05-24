/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Node } from "~/types/types";

export function truncateString(maxLength: number, str: string): string {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength) + "....";
  }
}

export function parseTiptapJsonToHtml(node: Node): string {
  if (!node) return "";

  switch (node.type) {
    case "doc":
      return node.content.map(parseTiptapJsonToHtml).join("");

    case "blockquote":
      return `<blockquote>${node.content ? node.content.map(parseTiptapJsonToHtml).join("") : ""}</blockquote>`;

    case "codeBlock":
      const languageClass = node.attrs.language
        ? ` class="language-${node.attrs.language}"`
        : "";
      return `<pre${languageClass}><code>${node.content.map(parseTiptapJsonToHtml).join("")}</code></pre>`;

    case "paragraph":
      return `<p>${node.content ? node.content.map(parseTiptapJsonToHtml).join("") : ""}</p>`;

    case "text":
      return node.text;
    default:
      return "";
  }

  return "";
}
