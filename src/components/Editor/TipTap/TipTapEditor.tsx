import React, { useState, useEffect, FC } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { extensions } from "./lib/extensions";
import Placeholder from "@tiptap/extension-placeholder";
import SlashCommandMenu from "./SlashCommand";
import SlashCommandExtension from "./lib/slashCommand";
import EditorMenuBar from "./EditorMenuBar";
import ImageUploadDialog from "./ImageUploadDialog";
import styles from "@/styles/TipTapEditor.module.scss";
import { Card } from "antd";
import HardBreak from "@tiptap/extension-hard-break";
import { useAppContext } from "@/components/ContextApi/AppContext";

interface TipTapEditorProps {
  isHeaderMenu?: boolean;
  onChange: (value: string) => void;
  height?: string | number;
  content: string;
  placeholder: string;
  onEnter?: () => void;
  bgColor?: string;
  borderRadius?: string;
  width?: string | number;
  submitOnEnter?: boolean;
}

const TipTapEditor: FC<TipTapEditorProps> = ({
  isHeaderMenu = false,
  height = 300,
  onChange,
  placeholder = "write something...",
  content,
  bgColor,
  onEnter,
  borderRadius,
  width,
  submitOnEnter,
}) => {
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { chatContext } = useAppContext();

  useEffect(() => {
    editor?.getHTML() !== content && editor?.commands.setContent(content, true);
  }, [content]);

  const editor = useEditor({
    extensions: [
      ...extensions,
      HardBreak,

      Placeholder.configure({
        placeholder: placeholder,
      }),

      SlashCommandExtension({
        onOpen: (position) => {
          setIsSlashMenuOpen(true);
          setSlashMenuPosition(position);
        },
        onClose: () => {
          setIsSlashMenuOpen(false);
        },
        onExecuteCommand: (command) => {
          command.execute({ editor });
          setIsSlashMenuOpen(false);
        },
      }),
    ],
    content: content,

    immediatelyRender: false,
    autofocus: chatContext?.isStreaming ? false : "end",

    editorProps: {
      handleKeyDown(view, event) {
        if (submitOnEnter && event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onEnter && onEnter();
          return true; // Stops propagation
        }
        if ((event.key === "Enter" && event.shiftKey) || (!submitOnEnter && event.key === "Enter")) {
          if (editor) {
            event.preventDefault();
            editor.chain().focus().setHardBreak().run();
          }
          return true;
        }

        // Allow Shift+Enter for line breaks
        return false;
      },

      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none p-6",
      },
    },
  });

  const handleImageSelected = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageDialog(false);
  };
  useEffect(() => {
    onChange(String(editor?.getHTML()));
  }, [editor?.getHTML()]);

  return (
    <Card
      style={{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        border: "none",
      }}
      styles={{
        body: {
          padding: 0,
          backgroundColor: bgColor ? bgColor : "var(--bg-input)",
          maxHeight: height,
        },
        header: { padding: "0 18px" },
      }}
      title={
        isHeaderMenu && editor ? <EditorMenuBar editor={editor} onImageClick={() => setShowImageDialog(true)} /> : null
      }
      className={`tip_tap_editor ${isHeaderMenu && styles.tip_tap_card} `}
    >
      <EditorContent
        editor={editor}
        className="editor-content"
        style={{ maxHeight: height, width: width ? width : "100%", overflowY: "auto" }}
      />
      {isSlashMenuOpen && editor && (
        <SlashCommandMenu editor={editor} position={slashMenuPosition} onClose={() => setIsSlashMenuOpen(false)} />
      )}
      {showImageDialog && (
        <ImageUploadDialog onClose={() => setShowImageDialog(false)} onImageSelected={handleImageSelected} />
      )}
    </Card>
  );
};

export default TipTapEditor;
