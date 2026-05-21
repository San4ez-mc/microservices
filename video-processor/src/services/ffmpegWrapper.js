const ffmpeg = require("fluent-ffmpeg");

if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}

function runCommand(configure) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    configure(command)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

module.exports = { ffmpeg, runCommand };
