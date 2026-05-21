const express = require("express");
const removeBgRoute = require("./routes/removeBg");
const overlayTextRoute = require("./routes/overlayText");
const composeRoute = require("./routes/compose");
const resizeRoute = require("./routes/resize");
const { err, ok } = require("./utils/mcp");

const app = express();
app.use(express.json({ limit: "25mb" }));

app.get("/health", (_req, res) => {
  res.json(ok({ body: {} }, { ok: true, service: "image-processor" }));
});

app.use("/remove-bg", removeBgRoute);
app.use("/overlay-text", overlayTextRoute);
app.use("/compose", composeRoute);
app.use("/resize", resizeRoute);

app.use((error, req, res, _next) => {
  const message = error.message || "Unexpected error";
  res.status(500).json(err(req, 500, message, { code: "IMAGE_PROCESSOR_ERROR" }));
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`image-processor listening on ${port}`);
});
