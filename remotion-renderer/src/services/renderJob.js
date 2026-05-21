const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");

async function renderKaraoke({ videoUrl, transcript, style, jobId, onProgress }) {
  const entryPoint = path.join(__dirname, "..", "composition", "index.ts");
  const bundleLocation = await bundle({ entryPoint });
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "Karaoke",
    inputProps: { videoUrl, words: transcript.words, style }
  });

  const outPath = path.join(process.env.TEMP_DIR || os.tmpdir(), `remotion-${jobId}.mp4`);
  await fs.mkdir(path.dirname(outPath), { recursive: true });

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outPath,
    inputProps: { videoUrl, words: transcript.words, style },
    onProgress
  });

  return outPath;
}

module.exports = { renderKaraoke };
