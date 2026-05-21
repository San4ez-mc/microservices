const express = require("express");
const path = require("path");
const { runCommand } = require("../services/ffmpegWrapper");
const { createJobDir, cleanupDir } = require("../utils/tempDir");
const { downloadToFile } = require("../utils/downloadVideo");
const { params, ok, err } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const jobDir = await createJobDir();
  try {
    const { videoUrl, platforms = [] } = params(req);
    if (!videoUrl || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json(err(req, 400, "videoUrl and platforms are required", { code: "INVALID_INPUT" }));
    }

    const input = await downloadToFile(videoUrl, jobDir, "input.mp4");
    const results = {};

    for (const platform of platforms) {
      const out = path.join(jobDir, `${platform}.mp4`);
      const options = ["-movflags +faststart"];
      await runCommand((cmd) => cmd.input(input).outputOptions(options).output(out));
      results[platform] = { videoUrl: null, videoPath: out, format: "MP4 H.264" };
    }

    res.json(ok(req, { results }));
  } catch (error) {
    next(error);
  } finally {
    if (process.env.NODE_ENV === "production") {
      await cleanupDir(jobDir);
    }
  }
});

module.exports = router;
