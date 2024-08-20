import { Button } from "./ui/button";
import { pages, useCurrentPage } from "../state/current-page";

export function Sidebar() {
  const {
    isCurrentPage,
    setCurrentPage,
  } = useCurrentPage();

  return (
    <div className="flex flex-col gap-3">
      {pages.map((page) => (
        <Button
          variant={isCurrentPage(page.name) ? "default" : "ghost"}
          className="border justify-start gap-3 font-normal"
          key={page.name}
          onClick={() => setCurrentPage(page.name)}
        >
          <page.icon size={16} />
          <span>{page.name}</span>
        </Button>
      ))}
    </div>
  );
}
