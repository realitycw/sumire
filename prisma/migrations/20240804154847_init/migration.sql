-- CreateTable
CREATE TABLE "History" (
    "history_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "manufacturer_name" TEXT,
    "supplier_name" TEXT,
    "transaction_date" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT
);
