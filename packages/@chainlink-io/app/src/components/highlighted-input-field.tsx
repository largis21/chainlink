// import { useCallback } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "./ui/tooltip";

// const charPairs = {
//   '"': '"',
//   "'": "'",
//   "{": "}",
// };

export function HighlightedInputField(props: {
  value: string;
  setValue: (setValue: string) => void;
  context: Record<string, unknown>;
}) {
  // const parts = props.value.split(/({{ ?.* ?}})/g);

  // const onChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const input = e.currentTarget;
  //     let value = input.value;
  //     const cursorPosition = input.selectionStart || 0;
  //
  //     // Get the last character typed
  //     const lastChar = value[cursorPosition - 1];
  //
  //     // Define a map for matching brackets and quotes
  //     const openingPairs: { [key: string]: string } = {
  //       "{": "}",
  //       '"': '"',
  //       "'": "'",
  //     };
  //
  //     const closingPairs: Record<string, string> = {
  //       "}": "{",
  //       '"': '"',
  //       "'": "'",
  //     };
  //
  //     const nextChar = value[cursorPosition];
  //
  //     if (lastChar in closingPairs && lastChar === nextChar) {
  //       requestAnimationFrame(() => {
  //         input.selectionStart = input.selectionEnd = cursorPosition;
  //       });
  //       return;
  //     }
  //
  //     if (lastChar in openingPairs) {
  //       // Insert the closing bracket
  //       value =
  //         value.slice(0, cursorPosition) +
  //         openingPairs[lastChar] +
  //         value.slice(cursorPosition);
  //
  //       // Update the input value
  //       props.setValue(value);
  //
  //       // Move the cursor back to its original position before the closing bracket
  //       requestAnimationFrame(() => {
  //         input.selectionStart = input.selectionEnd = cursorPosition;
  //       });
  //
  //       return;
  //     }
  //
  //     // Default behavior: just update the value
  //     props.setValue(value);
  //   },
  //   [props],
  // );

  return (
    <div className="w-full h-full relative">
      <input
        type="text"
        className="absolute inset-0 px-2 z-10 bg-background"
        value={props.value}
        onChange={(e) => props.setValue(e.currentTarget.value)}
        spellCheck={false}
      />
      {/* <div className="h-full absolute inset-0 flex items-center px-2">
        <span className="">
          {parts.map((part, index) =>
            index % 2 === 1 ? (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger className="text-orange-500">
                    {part}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>http://localhost:8080</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              part
            ),
          )}
        </span>
      </div> */}
    </div>
  );
}
