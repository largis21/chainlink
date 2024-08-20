import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";

async function _sendHeartBeat() {
  if (!import.meta.env.VITE_BACKEND_URL) {
    return false;
  }

  const heartBeat = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/heartbeat`,
  );

  return heartBeat.ok;
}

export function HeartBeat() {
  const [ok, setOk] = useState(true);

  async function sendHeartBeat() {
    setOk(await _sendHeartBeat());
  }

  useEffect(() => {
    sendHeartBeat();

    const interval = setInterval(sendHeartBeat, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (ok) {
    return null;
  }

  return (
    <Dialog open={!ok}>
      <DialogContent>
        Couldn't connect to server
      </DialogContent>
    </Dialog>
  );
}
