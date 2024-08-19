import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <div className="flex items-center justify-between border-b px-5 py-2">
      Chainlink
      <ThemeToggle />
    </div>
  );
}
