import React from "react";
import AIChatWidget from "./AIChatWidget";
import { useAppContext } from "../ContextApi/AppContext";
const AIChatPreview = () => {
  const { globalState } = useAppContext();
  return (
    <div>
      <AIChatWidget userName={globalState.session?.name || "Guest"} previewMode={true} />
    </div>
  );
};

export default AIChatPreview;
