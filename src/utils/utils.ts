import type { JsonValue, Node } from "~/types/types";

export function truncateString(maxLength: number, str: string): string {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength) + "....";
  }
}

export const isValidNode = (node: JsonValue): node is Node => {
  if (typeof node !== "object" || node === null || !("type" in node)) {
    return false;
  }

  const nodeType = (node as { type: string }).type;

  return (
    nodeType === "doc" ||
    nodeType === "paragraph" ||
    nodeType === "blockquote" ||
    nodeType === "text" ||
    nodeType === "codeBlock"
  );
};

export function parseTiptapJsonToHtml(node: Node | undefined): string {
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

    case "orderedList":
      return `<ol>${node.content ? node.content.map(parseTiptapJsonToHtml).join("") : ""}</ol>`;

    case "listItem":
      return `<li>${node.content ? node.content.map(parseTiptapJsonToHtml).join("") : ""}</li>`;

    case "paragraph":
      const content = node.content
        ? node.content.map(parseTiptapJsonToHtml).join("")
        : "";
      const classAttr = content.trim() === "" ? ' class="empty-paragraph"' : "";
      return `<p${classAttr}>${content}</p>`;

    case "text":
      return node.text;
    default:
      return "";
  }
}
