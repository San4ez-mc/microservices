const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function createJobDir() {
  const base = process.env.TEMP_DIR || "/tmp/video-processor";
  const dir = path.join(base, uuidv4());
  await fs.ensureDir(dir);
  return dir;
}

async function cleanupDir(dir) {
  if (dir) {
    await fs.remove(dir);
  }
}

module.exports = { createJobDir, cleanupDir };
