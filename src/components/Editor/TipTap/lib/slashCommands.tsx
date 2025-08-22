import React from "react";
import { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Image,
  Table,
  Link as LinkIcon,
} from "lucide-react";

interface CommandExecuteProps {
  editor: Editor;
}

export interface SlashCommand {
  title: string;
  description: string;
  icon: React.ReactNode;
  execute: (props: CommandExecuteProps) => void;
}

export const slashCommands: SlashCommand[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: <List size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .toggleBulletList()
        .run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: <ListOrdered size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .toggleOrderedList()
        .run();
    },
  },
  {
    title: "Code Block",
    description: "Display code with syntax highlight",
    icon: <Code size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .toggleCodeBlock()
        .run();
    },
  },
  {
    title: "Blockquote",
    description: "Capture a quote",
    icon: <Quote size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .toggleBlockquote()
        .run();
    },
  },
  {
    title: "Link",
    description: "Add a link to selected text",
    icon: <LinkIcon size={18} />,
    execute: ({ editor }) => {
      const url = window.prompt("Enter the URL:");

      // Remove the slash character
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .run();

      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
  },
  {
    title: "Image",
    description: "Insert an image",
    icon: <Image size={18} />,
    execute: ({ editor }) => {
      // Remove the slash character
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .run();

      // Create a custom event to trigger the image upload dialog
      const event = new CustomEvent("openImageUpload", {
        detail: {
          callback: (url: string) => {
            editor.chain().focus().setImage({ src: url }).run();
          },
        },
      });
      window.dispatchEvent(event);
    },
  },
  {
    title: "Table",
    description: "Insert a table",
    icon: <Table size={18} />,
    execute: ({ editor }) => {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: editor.state.selection.from - 1,
          to: editor.state.selection.from,
        })
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
];
