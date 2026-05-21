const express = require("express");
const extractAudioRoute = require("./routes/extractAudio");
const smartCutRoute = require("./routes/smartCut");
const burnSubtitlesRoute = require("./routes/burnSubtitles");
const thumbnailRoute = require("./routes/thumbnail");
const adaptPlatformRoute = require("./routes/adaptPlatform");
const { ok, err } = require("./utils/mcp");

const app = express();
app.use(express.json({ limit: "25mb" }));

app.get("/health", (_req, res) => {
  res.json(ok({ body: {} }, { ok: true, service: "video-processor" }));
});

app.use("/extract-audio", extractAudioRoute);
app.use("/smart-cut", smartCutRoute);
app.use("/burn-subtitles", burnSubtitlesRoute);
app.use("/thumbnail", thumbnailRoute);
app.use("/adapt-platform", adaptPlatformRoute);

app.use((error, req, res, _next) => {
  res.status(500).json(err(req, 500, error.message || "Unexpected error", { code: "VIDEO_PROCESSOR_ERROR" }));
});

const port = Number(process.env.PORT || 3003);
app.listen(port, () => {
  console.log(`video-processor listening on ${port}`);
});
