import * as monaco from "monaco-editor";
import { useCallback, useEffect, useRef } from "react";
import { useEventListener } from "usehooks-ts";

import { useTheme } from "@/components/theme-provider";

monaco.languages.typescript.typescriptDefaults.addExtraLib(
  `export declare global {
    var cl: { globals: Record<string, string> }
  }
`,
);

monaco.editor.defineTheme("theme-override-dark", {
  inherit: true,
  base: "vs-dark",
  rules: [],
  colors: {
    "editor.background": "#00000000",
  },
});

monaco.editor.defineTheme("theme-override-light", {
  inherit: true,
  base: "hc-light",
  rules: [],
  colors: {
    "editor.background": "#00000000",
  },
});

export function UrlEditor(props: {
  value: string;
  setValue: (newValue: string) => void;
}) {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();

  const theme = useTheme();

  const docRef = useRef(document);
  useEventListener(
    "resize",
    () => {
      if (!editor.current) return;
      editor.current.layout({} as monaco.editor.IDimension);
    },
    docRef,
  );

  console.log("Rerender");

  useEffect(() => {
    monaco.editor.setTheme(
      `theme-override-${theme.resolvedTheme || theme.theme}`,
    );
  }, [theme]);

  const mountEditor = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    if (editor.current) {
      editor.current.dispose();
      el.firstElementChild?.remove();
    }

    const model = monaco.editor.createModel(
      props.value,
      "typescript",
      monaco.Uri.parse(`file:///main-${Math.floor(Math.random() * 10000)}.tsx`),
    );

    const newEditor = monaco.editor.create(el, {
      model,
      theme: `theme-override-${theme.resolvedTheme || theme.theme}`,
      renderLineHighlight: "none",
      quickSuggestions: false,
      glyphMargin: false,
      lineDecorationsWidth: 0,
      folding: false,
      fixedOverflowWidgets: true,
      acceptSuggestionOnEnter: "on",
      hover: {
        delay: 100,
      },
      roundedSelection: false,
      contextmenu: false,
      cursorStyle: "line-thin",
      occurrencesHighlight: "off",
      links: false,
      minimap: { enabled: false },
      // see: https://github.com/microsoft/monaco-editor/issues/1746
      wordBasedSuggestions: "off",
      // disable `Find`
      find: {
        addExtraSpaceOnTop: false,
        autoFindInSelection: "never",
        seedSearchStringFromSelection: "never",
      },
      fontSize: 15,
      fontWeight: "normal",
      wordWrap: "off",
      lineNumbers: "off",
      lineNumbersMinChars: 0,
      overviewRulerLanes: 0,
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      scrollBeyondLastColumn: 0,
      scrollbar: {
        horizontal: "hidden",
        vertical: "hidden",
        // avoid can not scroll page when hover monaco
        alwaysConsumeMouseWheel: false,
      },
    });

    // This is the workaround for a bug in monaco-editor: https://github.com/microsoft/monaco-editor/issues/4455
    requestAnimationFrame(() => {
      if (el.firstElementChild) {
        (el.firstElementChild as HTMLElement).style.outline = "none";
      }
    });

    newEditor.onDidChangeCursorPosition((e) => {
      if (e.position.lineNumber > 1) {
        // Trim editor value
        newEditor.setValue(newEditor.getValue().trim());
        // Bring back the cursor to the end of the first line
        newEditor.setPosition({
          ...e.position,
          // Setting column to Infinity would mean the end of the line
          column: Infinity,
          lineNumber: 1,
        });
      }
    });

    newEditor.getModel()?.onDidChangeContent(() => {
      props.setValue(newEditor.getValue());
    });

    // @TODO Don't allow cursor to be outside of "`"
    // Don't allow selection of "`"
    // Don't allow deletion of "`"
    //
    // newEditor.onKeyDown(() => {
    //   requestAnimationFrame(() => {
    //     const value = newEditor.getValue();
    //     const cursorPos = newEditor.getPosition();
    //     let newValue = value;
    //
    //     if (!value.startsWith("`")) {
    //       console.log("Didn't start with `");
    //       newValue = "`" + newValue;
    //     }
    //
    //     if (!value.endsWith("`")) {
    //       newValue = newValue + "`";
    //     }
    //
    //     newEditor.setValue(newValue);
    //     if (cursorPos) {
    //       newEditor.setPosition(cursorPos);
    //     }
    //   });
    // });

    newEditor.onDidFocusEditorWidget(() => {
      console.log("onfocus");
    });

    editor.current = newEditor;
  }, []);

  return (
    <div className="w-full h-full bg-background flex items-center pl-4">
      <div ref={(el) => mountEditor(el)} className="w-full h-[22px]" />
    </div>
  );
}
