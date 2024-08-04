import type { MetaFunction } from "@remix-run/node";
import { TData } from "gridjs/dist/src/types.js";
import React, { useCallback, useEffect, useState } from "react";
import HistoryTable from "./history";
import InventoryTable from "./inventory";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchInventoryData = async (filters: Record<string, any>) => {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div style={{ display: "flex" }}>
      <div style={{ width: "200px", borderRight: "1px solid #ccc" }}>
        <button onClick={() => setCurrentTable("history")}>Dashboard</button>
        <button onClick={() => setCurrentTable("inventory")}>Inventory</button>
        {/* Add your filter inputs here */}
        <div>
          <input
            type="text"
            name="製品ID"
            placeholder="Item Name"
            onChange={handleFilterChange}
          />
          {/* <input
            type="number"
            name="minQuantity"
            placeholder="Min Quantity"
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            onChange={handleFilterChange}
          /> */}
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>{tables[currentTable]}</div>
    </div>
  );
}
