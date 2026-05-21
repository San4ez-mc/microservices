const { v4: uuidv4 } = require("uuid");

const jobs = new Map();

function createJob(payload) {
  const jobId = uuidv4();
  jobs.set(jobId, {
    jobId,
    status: "queued",
    progress: 0,
    framesRendered: 0,
    framesTotal: 0,
    videoUrl: null,
    error: null,
    payload
  });
  return jobs.get(jobId);
}

function updateJob(jobId, patch) {
  const existing = jobs.get(jobId);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  jobs.set(jobId, next);
  return next;
}

function getJob(jobId) {
  return jobs.get(jobId) || null;
}

module.exports = { createJob, updateJob, getJob };
