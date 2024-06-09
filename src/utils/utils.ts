import type { JsonValue, Node } from "~/types/types";
import toast, {
  type DefaultToastOptions,
  type Renderable,
} from "react-hot-toast";
import type { Editor } from "@tiptap/react";

export function truncateString(str: string, maxLength: number): string {
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

    case "image":
      console.log(node.attrs.title);
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

export function showSuccess (successMsg: string, action: () => unknown) {
  toast.success(successMsg)
  action?.()
}

export function showError(errorMsg: string) {
  toast.error(errorMsg);
}

export function showLoading(loadingMsg: string) {
  toast.loading(loadingMsg);
}

export function displayImageInEditor({
  filePath,
  editor,
  resolveFn,
  rejectFn
}: {
  filePath: string;
  editor: Editor;
  resolveFn: (value?: unknown) => void;
  rejectFn: (reason?: unknown) => void
}) {
  const newSrc = `https://iuqipxloifipusrsorab.supabase.co/storage/v1/object/public/image/${filePath}`;
  const image = new Image();
  image.src = newSrc;
  image.onload = () => {
    editor?.commands.setImage({ src: newSrc });
    editor?.commands.createParagraphNear();
    editor?.chain().focus().createParagraphNear();
    resolveFn();
  };
  image.onerror = () => {
    rejectFn()
  }
}
