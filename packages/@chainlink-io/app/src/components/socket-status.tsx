import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useCallback, useState } from "react";

import { useWs } from "../api/useWs";
import { useWsListener } from "../hooks/useWsListener";
import { Dialog, DialogContent } from "./ui/dialog";

export function SocketStatus() {
  const [status, setStatus] = useState<"open" | "closed">("open");

  const ws = useWs();

  const setToOpen = useCallback(() => {
    setStatus("open");
  }, []);

  const setToClosed = useCallback(() => {
    setStatus("closed");
  }, []);

  useWsListener(ws, "open", setToOpen);
  useWsListener(ws, "close", setToClosed);

  if (status === "open") {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent color="red">
        <DialogTitle>{"Couldn't connect to server"}</DialogTitle>
        <DialogDescription>
          {"Websocket is not in an 'open' state"}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
