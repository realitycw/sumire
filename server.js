import { PrismaClient } from "@prisma/client";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

app.use(express.json());
const prisma = new PrismaClient();

app.get("/api/v1/history", async (req, res) => {
  const {
    history_id,
    product_id,
    product_name,
    manufacturer_name,
    supplier_name,
    transaction_date,
    quantity,
    description,
  } = req.query;

  const filter = {};
  if (history_id) filter.history_id = history_id;
  if (product_id) filter.product_id = product_id;
  if (product_name) filter.product_name = product_name;
  if (manufacturer_name) filter.manufacturer_name = manufacturer_name;
  if (supplier_name) filter.supplier_name = supplier_name;
  if (transaction_date) filter.transaction_date = transaction_date;
  if (quantity) filter.quantity = quantity;
  if (description) filter.description = description;

  try {
    const history = await prisma.history.findMany({
      where: Object.keys(filter).length ? filter : undefined,
    });

    const count = await prisma.history.count({
      where: Object.keys(filter).length ? filter : undefined,
    });

    res.status(200).json({
      data: history,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/history", async (req, res) => {
  const {
    product_id,
    product_name,
    manufacturer_name,
    supplier_name,
    transaction_date,
    quantity,
    description,
  } = req.body;

  try {
    const save_history = await prisma.history.create({
      data: {
        product_id: product_id,
        product_name: product_name,
        manufacturer_name: manufacturer_name,
        supplier_name: supplier_name,
        transaction_date: transaction_date,
        quantity: quantity,
        description: description,
      },
    });
    res.status(201).json(save_history);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/v1/history/:id", async (req, res) => {
  const { id } = req.params;
  const {
    product_id,
    product_name,
    manufacturer_name,
    supplier_name,
    transaction_date,
    quantity,
    description,
  } = req.body;

  try {
    const update_history = await prisma.history.upsert({
      where: { history_id: parseInt(id, 10) },
      update: {
        product_id: product_id,
        product_name: product_name,
        manufacturer_name: manufacturer_name,
        supplier_name: supplier_name,
        transaction_date: transaction_date,
        quantity: quantity,
        description: description,
      },
      create: {
        history_id: { id: parseInt(id, 10) },
        product_id: product_id,
        product_name: product_name,
        manufacturer_name: manufacturer_name,
        supplier_name: supplier_name,
        transaction_date: transaction_date,
        quantity: quantity,
        description: description,
      },
    });
    res.status(200).json(update_history);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/v1/history/:id", async (req, res) => {
  const { id } = req.params;
  const {
    product_id,
    product_name,
    manufacturer_name,
    supplier_name,
    transaction_date,
    quantity,
    description,
  } = req.body;

  const filter = {};
  if (product_id) filter.product_id = product_id;
  if (product_name) filter.product_name = product_name;
  if (manufacturer_name) filter.manufacturer_name = manufacturer_name;
  if (supplier_name) filter.supplier_name = supplier_name;
  if (transaction_date) filter.transaction_date = transaction_date;
  if (quantity) filter.quantity = quantity;
  if (description) filter.description = description;

  try {
    const update_history = await prisma.history.update({
      where: { history_id: parseInt(id, 10) },
      data: filter,
    });
    res.status(200).json(update_history);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/v1/history/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const delete_history = await prisma.history.delete({
      where: { history_id: parseInt(id, 10) },
    });
    res.status(200).json(delete_history);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);
