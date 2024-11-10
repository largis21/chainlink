import { chainlinkRequestDefinitionSchema } from "@chainlink-io/types";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LoadedFile, NodePatch } from "@/state/loaded-files";

import { QueryParamsEditor } from "./query-params-editor";
import { UrlEditor } from "./url-editor";

const defaultMethods = ["POST", "GET", "PUT", "DELETE"] as const;
const requestEditorViews = [
  {
    name: "queryParams",
    title: "Query params",
    component: QueryParamsEditor,
  },
  {
    name: "headers",
    title: "Headers",
    component: QueryParamsEditor,
  },
  {
    name: "body",
    title: "Body",
    component: QueryParamsEditor,
  },
] as const;

export function RequestEditor(props: { file: LoadedFile }) {
  const [activeView, setActiveView] = useState<
    (typeof requestEditorViews)[number]
  >(requestEditorViews[0]);

  const requestDef = useMemo(() => {
    const parsedDefaultExport = chainlinkRequestDefinitionSchema.safeParse(
      props.file.exports.default,
    );

    return parsedDefaultExport.success ? parsedDefaultExport.data : null;
  }, [props.file]);

  const setUrlPatch = useCallback(
    (newValue: string) => {
      const urlPatchPath = "default.url";

      const newPatch: NodePatch = {
        path: urlPatchPath,
        nodeTypes: ["StringLiteral", "TemplateLiteral"],
        value: newValue,
      };

      const existingPatchIndex = props.file.patches.findIndex(
        (e) => e.path === urlPatchPath,
      );

      if (existingPatchIndex === -1) {
        props.file.patches.push(newPatch);
      } else {
        props.file.patches[existingPatchIndex] = newPatch;
      }

      console.log(props.file.patches[0]);
    },
    [props.file.patches],
  );

  if (!requestDef) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Invalid request definition
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-12 border-b flex">
        <div className="w-fit">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-r px-4 flex items-center gap-2 h-full">
              {requestDef.method}
              <ChevronDownIcon size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {defaultMethods.map((method) => (
                <DropdownMenuItem key={method}>{method}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full h-full relative">
          <UrlEditor
            value={props.file.stringifiedPropertySources.url || ""}
            setValue={setUrlPatch}
          />
        </div>

        <button
          className="px-8 border-l hover:bg-primary-foreground"
          // onClick={() => saveRequest(currentOpenedFilePath!)}
        >
          Send
        </button>
      </div>
      <div className="h-10 border-b flex">
        {requestEditorViews.map((view) => (
          <button
            key={view.name}
            className={cn(
              "h-full flex items-center border-r px-2 border-b-2 border-b-transparent",
              activeView.name === view.name && "border-b-orange-500",
            )}
            onClick={() => setActiveView(view)}
          >
            {view.title}
          </button>
        ))}
      </div>
      <div className="w-full flex-grow">
        <activeView.component />
      </div>
    </div>
  );
}
