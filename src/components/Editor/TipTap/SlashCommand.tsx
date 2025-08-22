import React, { useState, useEffect, useRef, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { slashCommands } from "./lib/slashCommands";
import styles from "@/styles/TipTapEditor.module.scss";

interface Position {
  x: number;
  y: number;
}

interface SlashCommandMenuProps {
  editor: Editor;
  position: Position;
  onClose: () => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ editor, position, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const commands = slashCommands;

  const executeCommand = useCallback(
    (index: number) => {
      const command = commands[index];
      if (command) {
        command.execute({ editor });
        onClose();
      }
    },
    [commands, editor, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commands.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((activeIndex + 1) % commands.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((activeIndex - 1 + commands.length) % commands.length);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(activeIndex);
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, commands.length, executeCommand, onClose]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!commands.length) return null;

  return (
    <div
      ref={menuRef}
      className={styles.slash_command_menu}
      style={{
        left: `${position.x}px`,
        top: `${position.y + 24}px`,
      }}
    >
      <div className={styles.slash_command_menu_list}>
        {commands.map((command, index) => (
          <button key={command.title} onClick={() => executeCommand(index)} onMouseEnter={() => setActiveIndex(index)}>
            <div className="icon">{command.icon}</div>
            <div>
              <div className="title">{command.title}</div>
              <div className="description">{command.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlashCommandMenu;
