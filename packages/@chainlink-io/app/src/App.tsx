import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { WSProvider } from "./api/useWs";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { SocketStatus } from "./components/socket-status";
import { ThemeProvider } from "./components/theme-provider";
import { useCurrentPage } from "./state/current-page";

const queryClient = new QueryClient();

const minimumVPWidth = 768;

function App() {
  const { CurrentPageComponent } = useCurrentPage();

  const [viewportIsTooSmall, setViewportIsTooSmall] = useState(
    window.innerWidth < minimumVPWidth,
  );

  const onResize = useCallback(() => {
    setViewportIsTooSmall(window.innerWidth < minimumVPWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  if (viewportIsTooSmall) {
    return (
      <div className="bg-background w-screen h-screen flex items-center justify-center">
        <h1>Sorry, Chainlink can only be used on desktop <br/> :(</h1>
      </div>
    );
  }

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
