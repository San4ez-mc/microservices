const express = require("express");
const storyRoute = require("./routes/story");
const panoramaRoute = require("./routes/panorama");
const coverRoute = require("./routes/cover");
const sliceRoute = require("./routes/slice");
const { err, ok } = require("./utils/mcp");

const app = express();
app.use(express.json({ limit: "25mb" }));

app.get("/health", (_req, res) => {
  res.json(ok({ body: {} }, { ok: true, service: "slide-builder" }));
});

app.use("/render/story", storyRoute);
app.use("/render/panorama", panoramaRoute);
app.use("/render/cover", coverRoute);
app.use("/slice", sliceRoute);

app.use((error, req, res, _next) => {
  res.status(500).json(err(req, 500, error.message || "Unexpected error", { code: "SLIDE_BUILDER_ERROR" }));
});

const port = Number(process.env.PORT || 3002);
app.listen(port, () => {
  console.log(`slide-builder listening on ${port}`);
});
