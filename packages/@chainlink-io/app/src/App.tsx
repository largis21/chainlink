import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketStatus } from "./components/socket-status";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { useCurrentPage } from "./state/current-page";
import { WSProvider } from "./api/useWs";

const queryClient = new QueryClient();

function App() {
  const { CurrentPageComponent } = useCurrentPage();

  return (
    <QueryClientProvider client={queryClient}>
      <WSProvider>
        <ThemeProvider>
          <SocketStatus />
          <div className="w-screen h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex flex-grow">
              <div className="w-64 border-r h-full p-3">
                <Sidebar />
              </div>
              <div className="flex-grow">
                <CurrentPageComponent />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </WSProvider>
    </QueryClientProvider>
  );
}

export default App;
