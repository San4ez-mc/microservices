const express = require("express");
const { getJob } = require("../services/jobQueue");

const router = express.Router();

router.get("/:jobId", (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) {
    return res.status(404).json({
      jsonrpc: "2.0",
      id: null,
      error: { code: 404, message: "Job not found", data: { jobId: req.params.jobId } }
    });
  }

  return res.json({
    jsonrpc: "2.0",
    id: null,
    result: {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      framesRendered: job.framesRendered,
      framesTotal: job.framesTotal,
      videoUrl: job.videoUrl,
      videoPath: job.videoPath || null,
      error: job.error
    }
  });
});

module.exports = router;
