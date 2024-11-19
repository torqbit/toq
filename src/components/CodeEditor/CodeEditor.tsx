import Editor, { useMonaco } from "@monaco-editor/react";

import { FC } from "react";
import { useAppContext } from "../ContextApi/AppContext";
import { $Enums } from "@prisma/client";
import { getCodeLanguage, getExtension } from "@/lib/utils";
import styles from "@/styles/LearnLecture.module.scss";
import { emmetHTML, emmetCSS } from "emmet-monaco-es";

const CodeEditor: FC<{
  className: string;
  defaultValue: string;
  updateAssignmentMap: (fileName: string, value: string) => void;
  fileName: string;
  readOnly: boolean;
  fileMap?: Map<string, string>;
  assignmentId?: number;
  saveAssignment?: (assignmentId: number, fileMap: Map<string, string>) => void;
}> = ({ className, defaultValue, updateAssignmentMap, fileName, readOnly, assignmentId, saveAssignment, fileMap }) => {
  const { globalState } = useAppContext();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    emmetHTML(monaco);
    emmetCSS(monaco);
    editor.getAction("editor.action.formatDocument").run();
    editor.addAction({
      id: "execute-save",
      label: "Save Assignment",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      contextMenuGroupId: "editor-cmds",
      run: (edit: any) => {
        const content = editor.getValue();
        edit.getAction("editor.action.formatDocument").run();
        if (fileMap) {
          const newMap = new Map(fileMap);
          if (newMap.has(fileName)) {
            newMap.set(fileName, content);
          } else {
            console.warn(`Key ${fileName} does not exist.`);
          }
          newMap && saveAssignment && assignmentId && saveAssignment(assignmentId, newMap);
        }
      },
    });
  };

  const getCodeWidth = () => {
    if (globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 460px)";
    } else if (!globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 645px)";
    } else if (globalState.collapsed && !globalState.lessonCollapsed) {
      return "calc(100vw - 720px)";
    } else {
      return "calc(100vw - 900px)";
    }
  };

  return (
    <>
      <Editor
        width={!readOnly ? getCodeWidth() : "100%"}
        className={styles.code__editor_container}
        theme={globalState.theme === "dark" ? "vs-dark" : "light"}
        height={"calc(100vh - 230px)"}
        language={getCodeLanguage(getExtension(fileName))}
        value={defaultValue}
        onChange={(e) => updateAssignmentMap(fileName, e as string)}
        options={{ readOnly, formatOnType: true }}
        onMount={handleEditorDidMount}
      />
    </>
  );
};

export default CodeEditor;
