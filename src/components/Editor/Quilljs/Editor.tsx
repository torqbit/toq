import dynamic from "next/dynamic";
import React, { FC } from "react";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const TextEditor: FC<{
  defaultValue: string;
  handleDefaultValue: (value: string) => void;
  readOnly: boolean;
  placeholder: string;
  className?: any;
  theme: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  border?: string;
  minHeight?: number;
}> = ({
  defaultValue,
  handleDefaultValue,
  readOnly,
  borderRadius,
  placeholder,
  width,
  height,
  className,
  theme,
  minHeight,
}) => {
  let toolbar = [
    [{ header: ["1", "2", "3", false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    ["link", "image"],
    ["code-block"],
  ];
  let bubbleToolbar = [["bold", "italic", "underline", "link"]];

  let SnowForamatter = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
    "align",
  ];

  let bubbleFormatter = ["header", "bold", "link", "image", "code-block", "underline", "italic"];

  return (
    <Quill
      className={`code_editor_wrapper ${className}`}
      readOnly={readOnly}
      placeholder={placeholder}
      style={{
        width: width,
        height: height,
        minHeight: minHeight,
        borderRadius: borderRadius,
      }}
      modules={{
        syntax: true,
        toolbar: theme === "bubble" ? bubbleToolbar : toolbar,
      }}
      formats={theme === "bubble" ? bubbleFormatter : SnowForamatter}
      theme={`${theme === "bubble" ? "bubble" : "snow"}`}
      value={defaultValue}
      onChange={(value) => {
        handleDefaultValue(value);
      }}
    />
  );
};

export default TextEditor;
