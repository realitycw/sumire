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
  const res = await fetch(`/api/v1/history?${queryParams}`);
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
  const res = await fetch(`/api/v1/inventory?${queryParams}`);
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
  const [currentView, setCurrentView] = useState<
    "inventory" | "history" | "postForm"
  >("inventory");
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const PostForm = () => {
    const [formData, setFormData] = useState({
      product_id: "",
      product_name: "",
      company_name: "",
      transaction_date: "",
      quantity: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const res = await fetch("/api/v1/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Failed to submit form data");
        }

        setSuccess(true);
        setFormData({
          product_id: "",
          product_name: "",
          company_name: "",
          transaction_date: "",
          quantity: "",
        });
      } catch (error) {
        const e = new Error();
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            製品ID:
            <input
              type="text"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            製品名:
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            会社名:
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            取引日:
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            数量:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  };

  const tables = {
    history: <HistoryTable data={historyData} />,
    inventory: <InventoryTable data={inventoryData} />,
    postForm: <PostForm />,
  };

  return (
    <div>
      <div>
        <p className="text-2xl text-gray-900 dark:text-white">
          在庫管理システム
        </p>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "200px", borderRight: "1px solid #ccc" }}>
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => setCurrentView("inventory")}
          >
            在庫一覧
          </button>
          <br />
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => setCurrentView("history")}
          >
            取引一覧
          </button>
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => setCurrentView("postForm")}
          >
            データ入力
          </button>
          <br />
          <div>
            <p className="text-xl text-gray-900 dark:text-white">Filter</p>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              取引ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              name="history_id"
              placeholder="0"
              onChange={handleFilterChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              製品ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="product_id"
              placeholder="商品ID"
              onChange={handleFilterChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              製品名
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="product_name"
              placeholder="製品名"
              onChange={handleFilterChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              会社
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="manufacturer_name"
              placeholder="会社"
              onChange={handleFilterChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              取引日
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              name="transaction_date"
              placeholder="YYYY-MM-DD"
              onChange={handleFilterChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              数量
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              name="quantity"
              placeholder="0"
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px" }}>{tables[currentView]}</div>
      </div>
    </div>
  );
}
