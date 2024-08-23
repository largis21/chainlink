import { Dialog, DialogContent } from "./ui/dialog";
import { useHeartbeat } from "../api/useApi";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export function HeartBeat() {
  const { status, error } = useHeartbeat();

  if (status === "pending" || status !== "error") {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent color="red">
        <DialogTitle>Couldn't connect to server</DialogTitle>
        <DialogDescription>{error.message}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
