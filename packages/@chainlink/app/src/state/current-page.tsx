import { LinkIcon, LucideProps, RadioTowerIcon } from "lucide-react";
import { create } from "zustand";
import { RequestsPage } from "../pages/requests-page";
import { ChainsPage } from "../pages/chains-page";

export const pages: {
  name: string
  icon: (props: Omit<LucideProps, "ref">) => React.ReactNode,
  page: () => React.ReactNode,
}[] = [
  {
    name: "Requests",
    icon: RadioTowerIcon,
    page: RequestsPage,
  },
  {
    name: "Chains",
    icon: LinkIcon,
    page: ChainsPage,
  },
] as const

type Page = typeof pages[number]["name"]

type CurrentPageState = {
  currentPage: Page
  setCurrentPage: (newPage: Page) => void
  isCurrentPage: (name: Page) => boolean
  CurrentPageComponent: () => React.ReactNode
}

export const useCurrentPage = create<CurrentPageState>((set, get) => ({
  currentPage: "Requests",
  setCurrentPage: (newPage) => set({currentPage: newPage}),
  isCurrentPage: (name) => get().currentPage === name,
  CurrentPageComponent: () => {
    const page = pages.find((e) => e.name === get().currentPage)
    if (!page) return <></>
    return <page.page />
  }
}))
