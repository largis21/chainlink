import { useState } from "react";
import { useEventListener } from "usehooks-ts";

import { WSProvider } from "@/api/useWs";
import { FileTree } from "@/components/file-tree";
import { Navbar } from "@/components/navbar";
import { SocketStatus } from "@/components/socket-status";
import { ThemeProvider } from "@/components/theme-provider";

const minimumVPWidth = 768;

function App() {
  const [viewportIsTooSmall, setViewportIsTooSmall] = useState(
    window.innerWidth < minimumVPWidth,
  );

  useEventListener("resize", () =>
    setViewportIsTooSmall(window.innerWidth < minimumVPWidth),
  );

  if (viewportIsTooSmall) {
    return (
      <div className="bg-background w-screen h-screen flex items-center justify-center">
        <h1>
          Sorry, Chainlink can only be used on desktop <br /> :(
        </h1>
      </div>
    );
  }

  return (
    <WSProvider>
      <ThemeProvider>
        <SocketStatus />
        <div className="w-screen h-screen bg-background flex flex-col">
          <Navbar />
          <div className="flex flex-grow">
            <div className="w-80 border-r h-full pt-2">
              <FileTree />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </WSProvider>
  );
}

export default App;
