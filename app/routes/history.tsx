import { Grid } from "gridjs-react";
import { TData } from "gridjs/dist/src/types.js";
import "gridjs/dist/theme/mermaid.css";

interface HisotryTableProps {
  data: TData[];
}

const HistoryTable = ({ data }: HisotryTableProps) => (
  <Grid
    data={data}
    columns={["履歴ID", "製品ID", "製品名", "会社", "取引日", "数量"]}
    pagination={{ limit: 5 }}
    sort={true}
  />
);

export default HistoryTable;
