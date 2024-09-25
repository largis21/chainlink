import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLoadedRequests } from "@/state/loaded-requests";

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

export function RequestEditor() {
  const [activeView, setActiveView] = useState<
    (typeof requestEditorViews)[number]
  >(requestEditorViews[0]);

  const currentOpenedFilePath = useLoadedRequests(
    (state) => state.currentOpenedFilePath,
  );
  const loadedRequests = useLoadedRequests((state) => state.loadedRequests);
  const saveRequest = useLoadedRequests((state) => state.saveRequestChanges);

  const currentLoadedReq = loadedRequests[currentOpenedFilePath as string];

  if (!currentLoadedReq) {
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
              {currentLoadedReq.requestDef.method}
              <ChevronDownIcon size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {defaultMethods.map((method) => (
                <DropdownMenuItem key={method}>{method}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full">
          <div className="w-full h-full relative">
            <UrlEditor
              value={currentLoadedReq.stringifiedPropertySources.url || ""}
              setValue={(newValue) =>
                (currentLoadedReq.localChanges.url = newValue)
              }
            />
          </div>
        </div>
        <button
          className="px-8 border-l hover:bg-primary-foreground"
          onClick={() => saveRequest(currentOpenedFilePath!)}
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
