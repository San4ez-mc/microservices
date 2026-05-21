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
    const { videoUrl, seekSec = 1, width = 1080, height = 1350 } = params(req);
    if (!videoUrl) {
      return res.status(400).json(err(req, 400, "videoUrl is required", { code: "INVALID_INPUT" }));
    }

    const input = await downloadToFile(videoUrl, jobDir, "input.mp4");
    const output = path.join(jobDir, "thumbnail.png");

    await runCommand((cmd) =>
      cmd
        .input(input)
        .seekInput(Number(seekSec || 1))
        .frames(1)
        .videoFilters(`scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`)
        .output(output)
    );

    const buffer = await fs.readFile(output);
    res.json(ok(req, { contentType: "image/png", imageBase64: buffer.toString("base64") }));
  } catch (error) {
    next(error);
  } finally {
    if (process.env.NODE_ENV === "production") {
      await cleanupDir(jobDir);
    }
  }
});

module.exports = router;
