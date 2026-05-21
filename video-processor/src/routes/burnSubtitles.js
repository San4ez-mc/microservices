const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const { runCommand } = require("../services/ffmpegWrapper");
const { createJobDir, cleanupDir } = require("../utils/tempDir");
const { downloadToFile } = require("../utils/downloadVideo");
const { params, ok, err } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const jobDir = await createJobDir();
  try {
    const { videoUrl, srtContent } = params(req);
    if (!videoUrl || !srtContent) {
      return res.status(400).json(err(req, 400, "videoUrl and srtContent are required", { code: "INVALID_INPUT" }));
    }

    const input = await downloadToFile(videoUrl, jobDir, "input.mp4");
    const srtPath = path.join(jobDir, "subs.srt");
    const output = path.join(jobDir, "subtitled.mp4");
    await fs.writeFile(srtPath, srtContent, "utf-8");

    await runCommand((cmd) =>
      cmd
        .input(input)
        .videoFilters(`subtitles=${srtPath}`)
        .outputOptions(["-c:v libx264", "-c:a copy"])
        .output(output)
    );

    res.json(ok(req, { videoUrl: null, videoPath: output }));
  } catch (error) {
    next(error);
  } finally {
    if (process.env.NODE_ENV === "production") {
      await cleanupDir(jobDir);
    }
  }
});

module.exports = router;
