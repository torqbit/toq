import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import History from "@tiptap/extension-history";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin } from "@tiptap/pm/state";

// Custom extension for drag handle
const DragHandle = Document.extend({
  addNodeView() {
    return ({ editor, getPos, node }) => {
      const dom = document.createElement("div");
      dom.classList.add("drag-handle");
      dom.setAttribute("draggable", "true");
      dom.setAttribute("data-drag-handle", "");

      dom.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        if (!target.hasAttribute("data-drag-handle")) return;

        const position = getPos();
        if (typeof position !== "number") return;

        const slice = editor.state.doc.slice(position, position + node.nodeSize);
        event.dataTransfer?.setData(
          "text/plain",
          JSON.stringify({
            type: "node",
            slice: slice.toJSON(),
            position,
          })
        );
      });

      return {
        dom,
        ignoreMutation: () => true,
        stopEvent: (event) => {
          return event.type === "dragstart" && (event.target as HTMLElement).hasAttribute("data-drag-handle");
        },
      };
    };
  },
});

export const extensions = [
  Document.extend({
    addProseMirrorPlugins() {
      return [];
    },
  }),
  Paragraph,
  Text,
  Bold,
  Italic,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  BulletList,
  OrderedList,
  ListItem,
  CodeBlock,
  Blockquote,
  Image,
  Table.configure({
    resizable: true,
  }),

  TableRow,
  TableCell,
  TableHeader,
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      style:
        "color: #3B82F6; text-decoration: underline; cursor: pointer; transition: color 0.2s ease-in-out; &:hover { color: #2563EB; }",
    },
    protocols: ["http", "https", "mailto", "tel"],
    validate: (href) => /^https?:\/\//.test(href) || /^mailto:/.test(href) || /^tel:/.test(href),
  }),
  History,
  Dropcursor,
  Gapcursor,
];
