const express = require("express");
const renderRoute = require("./routes/render");
const statusRoute = require("./routes/status");

const app = express();
app.use(express.json({ limit: "25mb" }));

app.get("/health", (_req, res) => {
  res.json({ jsonrpc: "2.0", id: null, result: { ok: true, service: "remotion-renderer" } });
});

app.use("/render", renderRoute);
app.use("/status", statusRoute);

app.use((error, req, res, _next) => {
  res.status(500).json({
    jsonrpc: "2.0",
    id: req.body?.id ?? null,
    error: { code: 500, message: error.message || "Unexpected error", data: { service: "remotion-renderer" } }
  });
});

const port = Number(process.env.PORT || 3004);
app.listen(port, () => {
  console.log(`remotion-renderer listening on ${port}`);
});
