const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

async function downloadToFile(url, targetDir, filename = "input.mp4") {
  const filePath = path.join(targetDir, filename);
  const response = await axios.get(url, { responseType: "stream", timeout: 60000 });
  await fs.ensureDir(targetDir);

  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(filePath);
    response.data.pipe(out);
    out.on("finish", resolve);
    out.on("error", reject);
  });

  return filePath;
}

module.exports = { downloadToFile };
