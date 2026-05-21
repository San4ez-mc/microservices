const express = require("express");
const { createJob, updateJob } = require("../services/jobQueue");
const { renderKaraoke } = require("../services/renderJob");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const body = req.body?.params || req.body || {};
    const { videoUrl, transcript, style = {}, callbackUrl } = body;

    if (!videoUrl || !transcript || !Array.isArray(transcript.words)) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: req.body?.id ?? null,
        error: { code: 400, message: "videoUrl and transcript.words are required", data: { field: "videoUrl|transcript.words" } }
      });
    }

    const job = createJob({ videoUrl, transcript, style, callbackUrl });

    res.status(202).json({
      jsonrpc: "2.0",
      id: req.body?.id ?? null,
      result: {
        jobId: job.jobId,
        status: "queued",
        estimatedSec: 120
      }
    });

    renderKaraoke({
      videoUrl,
      transcript,
      style,
      jobId: job.jobId,
      onProgress: ({ renderedFrames, encodedFrames }) => {
        const framesRendered = Math.max(renderedFrames || 0, encodedFrames || 0);
        updateJob(job.jobId, {
          status: "rendering",
          framesRendered,
          progress: framesRendered > 0 && job.framesTotal > 0 ? framesRendered / job.framesTotal : 0
        });
      }
    })
      .then((outputPath) => {
        updateJob(job.jobId, {
          status: "done",
          progress: 1,
          videoUrl: null,
          videoPath: outputPath
        });
      })
      .catch((error) => {
        updateJob(job.jobId, {
          status: "failed",
          error: error.message
        });
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
