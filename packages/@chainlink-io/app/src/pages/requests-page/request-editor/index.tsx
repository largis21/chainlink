import { HighlightedInputField } from "@/src/components/highlighted-input-field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { FsDirectoryFileNode } from "@chainlink-io/core";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { QueryParamsEditor } from "./query-params-editor";
import { cn } from "@/src/lib/utils";

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

export function RequestEditor(props: {
  selectedFile: FsDirectoryFileNode | null;
}) {
  const [requestUrl, setRequestUrl] = useState("{{ params.baseUrl }}");
  const [activeView, setActiveView] = useState<
    (typeof requestEditorViews)[number]
  >(requestEditorViews[0]);

  if (!props.selectedFile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Please select a file
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-12 border-b flex">
        <div className="w-fit">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-r px-4 flex items-center gap-2 h-full">
              POST
              <ChevronDownIcon size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {defaultMethods.map((method) => (
                <DropdownMenuItem key={method}>{method}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-grow">
          <div className="w-full h-full relative">
            <HighlightedInputField
              value={requestUrl}
              setValue={setRequestUrl}
              context={{}}
            />
          </div>
        </div>
      </div>
      <div className="h-10 border-b flex">
        {requestEditorViews.map((view) => (
          <button
            key={view.name}
            className={cn(
              "h-full flex items-center border-r px-2 border-b-2 border-b-transparent",
              activeView.name === view.name && "border-b-pink-500",
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
