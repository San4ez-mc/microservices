const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const { ffmpeg, runCommand } = require("../services/ffmpegWrapper");
const { createJobDir, cleanupDir } = require("../utils/tempDir");
const { downloadToFile } = require("../utils/downloadVideo");
const { params, ok, err } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const jobDir = await createJobDir();
  try {
    const { videoUrl, format = "mp3", sampleRate = 16000 } = params(req);
    if (!videoUrl) {
      return res.status(400).json(err(req, 400, "videoUrl is required", { code: "INVALID_INPUT" }));
    }

    const input = await downloadToFile(videoUrl, jobDir, "input.mp4");
    const output = path.join(jobDir, `audio.${format}`);

    await runCommand((cmd) =>
      cmd
        .input(input)
        .audioChannels(1)
        .audioFrequency(sampleRate)
        .toFormat(format)
        .output(output)
    );

    const stat = await fs.stat(output);
    const probe = await new Promise((resolve, reject) => ffmpeg.ffprobe(input, (err, data) => (err ? reject(err) : resolve(data))));

    res.json(ok(req, {
      audioUrl: null,
      audioPath: output,
      durationSec: Number(probe.format.duration || 0),
      sizeBytes: stat.size
    }));
  } catch (error) {
    next(error);
  } finally {
    if (process.env.NODE_ENV === "production") {
      await cleanupDir(jobDir);
    }
  }
});

module.exports = router;
