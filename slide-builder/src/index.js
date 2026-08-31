const express = require("express");
const storyRoute = require("./routes/story");
const panoramaRoute = require("./routes/panorama");
const coverRoute = require("./routes/cover");
const sliceRoute = require("./routes/slice");
const { err, ok } = require("./utils/mcp");

const app = express();
// 25mb was fine for flat-color carousels; тепер слайди з реальними фото (галерея проєкту)
// роблять панораму на 8-10 слайдів помітно важчою — піднято ліміт, щоб /slice не падав 413/500.
app.use(express.json({ limit: "60mb" }));

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
