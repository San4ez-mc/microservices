const fs = require("fs-extra");
const path = require("path");
const { runCommand } = require("./ffmpegWrapper");

function inverseSegments(removeSegments, durationSec) {
  const sorted = [...removeSegments].sort((a, b) => a.from - b.from);
  const keep = [];
  let cursor = 0;

  for (const s of sorted) {
    if (s.from > cursor) {
      keep.push({ from: cursor, to: s.from });
    }
    cursor = Math.max(cursor, s.to);
  }

  if (cursor < durationSec) {
    keep.push({ from: cursor, to: durationSec });
  }

  return keep.filter((s) => s.to - s.from > 0.05);
}

async function cutAndConcat(inputFile, keepSegments, jobDir, reencodeAudio = true) {
  const parts = [];

  for (let i = 0; i < keepSegments.length; i += 1) {
    const segment = keepSegments[i];
    const out = path.join(jobDir, `segment-${i}.mp4`);
    await runCommand((cmd) =>
      cmd
        .input(inputFile)
        .setStartTime(segment.from)
        .setDuration(segment.to - segment.from)
        .outputOptions(reencodeAudio ? ["-c:v libx264", "-c:a aac"] : ["-c copy"])
        .output(out)
    );
    parts.push(out);
  }

  const concatList = path.join(jobDir, "concat.txt");
  await fs.writeFile(concatList, parts.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n"), "utf-8");

  const finalOut = path.join(jobDir, "smart-cut.mp4");
  await runCommand((cmd) =>
    cmd
      .input(concatList)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c copy"])
      .output(finalOut)
  );

  return finalOut;
}

module.exports = { inverseSegments, cutAndConcat };
