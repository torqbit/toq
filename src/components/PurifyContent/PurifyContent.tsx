import DOMPurify from "isomorphic-dompurify";
import React from "react";
import { FC } from "react";

const PurifyContent: FC<{ content: string; className?: string }> = ({ content, className }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <article className="prose lg:prose-base">
      <div className={`${className} "purify_info"`} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </article>
  );
};

export default PurifyContent;
