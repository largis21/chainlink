"use client"

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Home, type LucideProps } from "lucide-react";
import Link from "next/link";

function SidebarItem(props: {
  children: React.ReactNode
  icon: (props: LucideProps) => React.ReactNode
  href: string
}) {
  const path = usePathname()

  return (
    <Link className="w-full" href={props.href}>
      <Button
        variant={path === props.href ? "default" : "ghost"}
        className="border justify-start gap-3 font-normal w-full"
        key={props.href}
      >
        <props.icon size={16} />
        <span>{props.children}</span>
      </Button>
    </Link>
  )
}

export function Sidebar() {
  return (
    <div className="flex flex-col gap-3">
      <SidebarItem href={"/"} icon={Home}>
        Home
      </SidebarItem>
      <SidebarItem href={"/requests"} icon={Home}>
        Requests
      </SidebarItem>
    </div>
  );
}
