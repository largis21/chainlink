import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

export function QueryParamsEditor() {
  return (
    <div className="w-full h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Enabled</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(3).fill(0).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Checkbox />
              </TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
