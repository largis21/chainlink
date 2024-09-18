export function HighlightedInputField(props: {
  initial: string;
  setValue: (setValue: string) => void;
  context: Record<string, unknown>;
}) {
  return (
    <div className="w-full h-full relative">
      <input
        type="text"
        className="absolute inset-0 px-2 z-10 bg-background"
        defaultValue={props.initial}
        onChange={(e) => props.setValue(e.currentTarget.value)}
        spellCheck={false}
      />
    </div>
  );
}
