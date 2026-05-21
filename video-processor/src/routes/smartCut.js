const express = require("express");
const { ffmpeg } = require("../services/ffmpegWrapper");
const { inverseSegments, cutAndConcat } = require("../services/segmentCutter");
const { createJobDir, cleanupDir } = require("../utils/tempDir");
const { downloadToFile } = require("../utils/downloadVideo");
const { params, ok, err } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const jobDir = await createJobDir();
  try {
    const { videoUrl, removeSegments = [], reencodeAudio = true } = params(req);
    if (!videoUrl || !Array.isArray(removeSegments) || removeSegments.length === 0) {
      return res.status(400).json(err(req, 400, "videoUrl and removeSegments are required", { code: "INVALID_INPUT" }));
    }

    const input = await downloadToFile(videoUrl, jobDir, "input.mp4");
    const probe = await new Promise((resolve, reject) => ffmpeg.ffprobe(input, (err, data) => (err ? reject(err) : resolve(data))));
    const durationSec = Number(probe.format.duration || 0);
    const keepSegments = inverseSegments(removeSegments, durationSec);
    const output = await cutAndConcat(input, keepSegments, jobDir, reencodeAudio);

    const removedSec = removeSegments.reduce((acc, seg) => acc + Math.max(0, seg.to - seg.from), 0);
    res.json(ok(req, {
      videoUrl: null,
      videoPath: output,
      originalDurationSec: durationSec,
      finalDurationSec: Math.max(0, durationSec - removedSec),
      removedSec,
      segmentsRemoved: removeSegments.length
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
