import type { MetaFunction } from "@remix-run/node";
import { fetchData } from "@remix-run/react/dist/data";
import { filter } from "compression";
import { useState } from "react";

const fetchHistoryData = async (filters: Record<string, any>) => {
  const queryParams = new URLSearchParams(
    Object.entries(filters)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => [key, value])
  ).toString();
  const res = await fetch(`localhost:3000/api/v1/history?${queryParams}`);
  if (!res.ok) {
    throw new Error("Faild to fetch data");
  }
  return res.json();
};


export const meta: MetaFunction = () => {
  return [
    { title: "Sumrie" },
    { name: "description", content: "Inventory Management System" },
  ];
};

export default function Index() {
  const [currentTable, setCurrentTable] = useState<"inventory" | "history">(
    "inventory"
  );
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({
    history_id: "",
    product_id: "",
    product_name: "",
    manufacturer_name: "",
    supplier_name: "",
    transaction_date: "",
    quantity: "",
    description: "",
  });

  const updateData = async () => {
    try {
      const [history, inventory] = await Promise.all([
        fetchHistoryData(filters),
        
      ])
    }
  }

  return <div></div>;
}
