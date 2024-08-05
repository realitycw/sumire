import type { MetaFunction } from "@remix-run/node";
import { TData } from "gridjs/dist/src/types.js";
import React, { useCallback, useEffect, useState } from "react";
import HistoryTable from "./history";
import InventoryTable from "./inventory";

const fetchHistoryData = async (filters: Record<string, string>) => {
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

const fetchInventoryData = async (filters: Record<string, string>) => {
  const queryParams = new URLSearchParams(
    Object.entries(filters)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => [key, value])
  ).toString();
  const res = await fetch(`localhost:3000/api/v1/inventory?${queryParams}`);
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
  const [historyData, setHistoryData] = useState<TData[]>([]);
  const [inventoryData, setInventoryData] = useState<TData[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({
    history_id: "",
    product_id: "",
    product_name: "",
    manufacturer_name: "",
    transaction_date: "",
    quantity: "",
  });

  const updateData = useCallback(async () => {
    try {
      const [history, inventory] = await Promise.all([
        fetchHistoryData(filters),
        fetchInventoryData(filters),
      ]);
      setHistoryData(history);
      setInventoryData(inventory);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [filters]);

  useEffect(() => {
    updateData();
    const intervalId = setInterval(updateData, 10000);
    return () => clearInterval(intervalId);
  }, [filters, updateData]);

  const handleFilterChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = Event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const tables = {
    history: <HistoryTable data={historyData} />,
    inventory: <InventoryTable data={inventoryData} />,
  };

  return (
    <div>
      <div>
        <h1>在庫管理システム</h1>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "200px", borderRight: "1px solid #ccc" }}>
          <button onClick={() => setCurrentTable("inventory")}>
            Inventory
          </button>
          <br />
          <button onClick={() => setCurrentTable("history")}>History</button>
          <br />
          <div>
            <h2>Filter</h2>
            <input
              type="number"
              name="履歴ID"
              placeholder="履歴ID"
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="製品ID"
              placeholder="製品ID"
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="製品名"
              placeholder="製品名"
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px" }}>{tables[currentTable]}</div>
      </div>
    </div>
  );
}
