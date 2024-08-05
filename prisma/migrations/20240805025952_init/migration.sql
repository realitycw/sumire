/*
  Warnings:

  - You are about to drop the column `company` on the `History` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "history_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "company_name" TEXT,
    "transaction_date" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL
);
INSERT INTO "new_History" ("history_id", "product_id", "product_name", "quantity", "transaction_date") SELECT "history_id", "product_id", "product_name", "quantity", "transaction_date" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
