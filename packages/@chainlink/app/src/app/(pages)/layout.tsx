import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <div className="bg-background flex h-screen w-screen flex-col">
        <Navbar />
        <div className="flex flex-grow">
          <div className="h-full w-64 border-r p-3">
            <Sidebar />
          </div>
          <div className="flex-grow">{props.children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
