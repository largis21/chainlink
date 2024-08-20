import { HeartBeat } from "./components/heartbeat";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { useCurrentPage } from "./state/current-page";

function App() {
  const {CurrentPageComponent} = useCurrentPage()

  return (
    <ThemeProvider>
      <HeartBeat />
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
  );
}

export default App;
