import { Grid } from "gridjs-react";
import { TData } from "gridjs/dist/src/types.js";
import "gridjs/dist/theme/mermaid.css";

interface InventoryTableProps {
  data: TData[];
}

const InventoryTable = ({ data }: InventoryTableProps) => (
  <Grid
    data={data}
    columns={["製品ID", "製品名", "数量"]}
    pagination={{ limit: 5 }}
    sort={true}
  />
);

export default InventoryTable;
