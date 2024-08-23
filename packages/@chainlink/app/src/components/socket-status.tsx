import { Dialog, DialogContent } from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Socket } from "../api/useWs";
import { useCallback, useContext, useEffect, useState } from "react";

export function SocketStatus() {
  const [status, setStatus] = useState<"open" | "closed">("open");

  const socket = useContext(Socket);

  const setToOpen = useCallback(() => {
    setStatus("open");
  }, []);

  const setToClosed = useCallback(() => {
    setStatus("closed");
  }, []);

  useEffect(() => {
    if (!socket) {
      setToClosed();
      return;
    }

    socket.addEventListener("open", setToOpen);
    socket.addEventListener("close", setToClosed);

    return () => {
      socket?.removeEventListener("open", setToOpen);
      socket?.removeEventListener("close", setToClosed);
    };
  }, [socket, setToOpen, setToClosed]);

  if (status === "open") {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent color="red">
        <DialogTitle>Couldn't connect to server</DialogTitle>
        <DialogDescription>Websocket is not in an 'open' state</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
