import { Theme } from "@/types/theme";
import React, { FC, MutableRefObject, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import rehypeRaw from "rehype-raw";
import dynamic from "next/dynamic";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import SvgIcons from "../SvgIcons";

interface MarkdownToJsxProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
  theme?: Theme;
}
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter").then((mod) => mod.Prism) as any, {
  ssr: false,
});

const MarkdownToJsx: FC<MarkdownToJsxProps> = React.memo(({ content, className, theme, isStreaming }) => {
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(text);
        setCopiedCode(text);
        setTimeout(() => setCopiedCode(""), 2000);
      } else {
        throw new Error("Clipboard API not supported or available.");
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");
    const isCodeCopied = copiedCode === codeString;
    const isInline = inline || !className;

    if (isInline) {
      return (
        <code
          className={`inline px-1.5 py-0.5 ${
            theme == "light" && "light-code-block"
          } rounded text-sm font-mono  text-[var(--font-secondary)] `}
        >
          {children}
        </code>
      );
    }

    // Fallback styling when SyntaxHighlighter is not available
    if (!SyntaxHighlighter) {
      return (
        <div className="relative my-6 group">
          {!isStreaming && (
            <div className={`absolute top-3 right-3 z-10`}>
              <button
                onClick={() => copyToClipboard(codeString)}
                className={`p-2 rounded-md transition-all duration-200 bg-[var(--bg-secondary)] opacity-0 group-hover:opacity-100`}
                title="Copy code"
              >
                {isCodeCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          )}
          <pre
            className={`rounded-lg bg-transparent p-4 pr-8 text-[var(--font-secondary)] overflow-x-auto border font-mono text-sm `}
          >
            <code className="bg-transparent">{children}</code>
          </pre>
        </div>
      );
    }

    const selectedStyle = theme === "dark" ? oneDark : oneLight;

    return (
      <div className="relative  group highlighted-pre">
        {!isStreaming && (
          <div className={`absolute top-3 right-3 z-10 `}>
            <button
              onClick={() => copyToClipboard(codeString)}
              className={`p-2 rounded-md transition-all text-[var(--font-primary)] hover:bg-[var(--bg-segment)] bg-[var(--bg-chat-code)] cursor-pointer duration-200  opacity-0 group-hover:opacity-100`}
              title="Copy code"
            >
              {isCodeCopied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <i className="text-[18px] text-[var(--font-secondary)]">{SvgIcons.copy}</i>
              )}
            </button>
          </div>
        )}
        <SyntaxHighlighter
          style={selectedStyle}
          language={language || "text"}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "1rem",

            lineHeight: "1.5",

            // Make room for copy button
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  };

  const ImageBlock = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      {...props}
      className="border-[1px]  border-[var(--border-color)]"
      style={{
        maxWidth: "100%",
        borderStyle: "solid",
        borderRadius: "8px",

        ...(props.style || {}),
      }}
      alt={props.alt || ""}
    />
  );

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ code: CodeBlock, img: ImageBlock }}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownToJsx;
