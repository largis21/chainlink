import { Checkbox } from "@/src/components/ui/checkbox";
import { useCallback, useState } from "react";
import type { ChainlinkRequestTemplate } from "@chainlink-io/core";
import { cn } from "@/src/lib/utils";

type QueryParams = (ChainlinkRequestTemplate["queryParams"][number] & {
  id: string;
})[];

const getTableInputId = (param: QueryParams[number], column: "key" | "value") =>
  `queryParamTableInput-${column}-${param.id}`;

export function QueryParamsEditor() {
  const [queryParams, _setQueryParams] = useState<QueryParams>([
    {
      id: "0",
      enabled: true,
      key: "path",
      value: "value",
    },
  ]);

  const setQueryParam = useCallback(
    <K extends keyof QueryParams[number]>(
      id: string,
      set: K,
      value: QueryParams[number][K],
    ) => {
      if (["key", "value"].includes(set) && value === "") {
        _setQueryParams(queryParams.filter((e) => e.id !== id));
        document.getElementById(`newQueryParamTableInput-${set}`)?.focus();
        return;
      }

      const queryParamToChange = queryParams.find((e) => e.id === id);
      if (!queryParamToChange) {
        console.error(
          `Could not set query param '${id}' because it does not exist`,
        );
        return;
      }

      queryParamToChange[set] = value;
      _setQueryParams([...queryParams]);
    },
    [queryParams],
  );

  const createQueryParam = useCallback(
    (queryParam: Omit<QueryParams[number], "id">): QueryParams[number] => {
      const getNewId = () => Math.floor(Math.random() * 1000).toString();

      let newIdIsAvailable = false;
      let id = "";
      while (!newIdIsAvailable) {
        id = getNewId();
        if (queryParams.find((e) => e.id === id)) continue;
        newIdIsAvailable = true;
      }

      const newQueryParam = { ...queryParam, id };
      _setQueryParams([...queryParams, newQueryParam]);
      return newQueryParam;
    },
    [queryParams],
  );

  return (
    <div className="w-full h-full">
      <table>
        <thead>
          <TableRow className="border-b">
            <TableHeader></TableHeader>
            <TableHeader>Key</TableHeader>
            <TableHeader>Value</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {queryParams.map((paramItem) => (
            <TableRow key={paramItem.id}>
              <TableData className="px-2 my-auto">
                <Checkbox
                  checked={paramItem.enabled}
                  onClick={() =>
                    setQueryParam(paramItem.id, "enabled", !paramItem.enabled)
                  }
                />
              </TableData>
              <TableData>
                <TableDataInput
                  value={paramItem.key}
                  onChange={(e) =>
                    setQueryParam(paramItem.id, "key", e.currentTarget.value)
                  }
                  id={getTableInputId(paramItem, "key")}
                />
              </TableData>
              <TableData>
                <TableDataInput
                  value={paramItem.value}
                  onChange={(e) =>
                    setQueryParam(paramItem.id, "value", e.currentTarget.value)
                  }
                  id={getTableInputId(paramItem, "value")}
                />
              </TableData>
            </TableRow>
          ))}
          <TableRow>
            <TableData>
              <Checkbox disabled checked />
            </TableData>
            <TableData>
              <TableDataInput
                id="newQueryParamTableInput-key"
                value={""}
                onChange={(e) => {
                  const queryParam = createQueryParam({
                    key: e.currentTarget.value,
                    value: "",
                    enabled: true,
                  });
                  requestAnimationFrame(() => {
                    document
                      .getElementById(getTableInputId(queryParam, "key"))
                      ?.focus();
                  });
                }}
              />
            </TableData>
            <TableData>
              <TableDataInput
                id="newQueryParamTableInput-value"
                value={""}
                onChange={(e) => {
                  const queryParam = createQueryParam({
                    value: e.currentTarget.value,
                    key: "",
                    enabled: true,
                  });
                  requestAnimationFrame(() => {
                    document
                      .getElementById(getTableInputId(queryParam, "key"))
                      ?.focus();
                  });
                }}
              />
            </TableData>
          </TableRow>
        </tbody>
      </table>
    </div>
  );
}

function TableRow(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >,
) {
  return <tr className={cn("border-b", props.className)} {...props}>{props.children}</tr>;
}

function TableHeader(
  props: React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >,
) {
  return (
    <th className={cn("px-2 py-1 border-r text-left", props.className)} {...props}>
      {props.children}
    </th>
  );
}

function TableData(
  props: React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >,
) {
  return (
    <td className={cn("px-2 py-1 border-r", props.className)} {...props}>
      {props.children}
    </td>
  );
}

function TableDataInput(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  return <input type="text" className={cn("bg-background", props.className)} {...props} />;
}
