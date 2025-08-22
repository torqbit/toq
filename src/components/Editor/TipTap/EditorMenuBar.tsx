import React from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Image,
  Table,
  Link as LinkIcon,
} from "lucide-react";
import styles from "@/styles/TipTapEditor.module.scss";
import { Button } from "antd";

interface EditorMenuBarProps {
  editor: Editor;
  onImageClick: () => void;
}

const EditorMenuBar: React.FC<EditorMenuBarProps> = ({ editor, onImageClick }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className={styles.editor_menu_bar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={styles.editor_menu_bar_button}
        title="Bold"
        type="button"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic"
        className={styles.editor_menu_bar_button}
        type="button"
      >
        <Italic size={16} />
      </button>
      <div className={styles.divider}></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={styles.editor_menu_bar_button}
        title="Heading 1"
        type="button"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={styles.editor_menu_bar_button}
        title="Heading 2"
        type="button"
      >
        <Heading2 size={16} />
      </button>
      <div className={styles.divider}></div>
      <button
        className={styles.editor_menu_bar_button}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
        type="button"
      >
        <List size={16} />
      </button>
      <button onClick={setLink} type="button" className={styles.editor_menu_bar_button} title="Link">
        <LinkIcon size={16} />
      </button>
      <button
        className={styles.editor_menu_bar_button}
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <div className={styles.divider}></div>
      <button
        className={styles.editor_menu_bar_button}
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        <Quote size={16} />
      </button>
      <button
        className={styles.editor_menu_bar_button}
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <Code size={16} />
      </button>
      <div className={styles.divider}></div>
    </div>
  );
};

export default EditorMenuBar;
