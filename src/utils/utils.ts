import type { JsonValue, Node } from "~/types/types";
import toast, {
  type DefaultToastOptions,
  type Renderable,
} from "react-hot-toast";

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength) + "....";
  }
}

export function randomName(lenght: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

  return Array.from({ length: lenght }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ).join("");
}

export function getDayAndMonth(date: Date) {
  const monthAndDay = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return monthAndDay;
}

export function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diff / 60000);

  if (diffMinutes < 1) {
    return "now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)} hours ago`;
  } else if (diffMinutes < 2880) {
    return "yesterday";
  } else if (diffMinutes < 10080) {
    return date.toLocaleString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

    case "image":
      return `<img src="${node.attrs.src}" alt="${node.attrs.alt}" />`;

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

type ShowSuccessParams = {
  successMsg: string;
  loadingMsg: string | Renderable;
  errorMsg: string;
  action?: () => unknown;
  promise: Promise<unknown>;
  toastOptions: DefaultToastOptions | undefined;
};

export async function showLoadingPromise({
  successMsg,
  loadingMsg,
  errorMsg,
  action,
  promise,
  toastOptions,
}: ShowSuccessParams) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  toast.promise(
    promise,
    {
      success: successMsg,
      loading: loadingMsg,
      error: errorMsg,
    },
    toastOptions,
  );

  await promise;
  action?.();
}

export function showSuccess(successMsg: string, action: () => unknown) {
  toast.success(successMsg);
  action?.();
}

export function showError(errorMsg: string) {
  toast.error(errorMsg);
}

export function showLoading(loadingMsg: string) {
  toast.loading(loadingMsg);
}
