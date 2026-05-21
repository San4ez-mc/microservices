const axios = require("axios");

function parseBase64DataUrl(imageBase64) {
  const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid imageBase64 format");
  }
  return Buffer.from(match[2], "base64");
}

async function getImageBuffer({ imageUrl, imageBase64, maxMb = 20 }) {
  if (imageBase64) {
    return parseBase64DataUrl(imageBase64);
  }

  if (!imageUrl) {
    throw new Error("Either imageUrl or imageBase64 is required");
  }

  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
    timeout: 30000,
    maxContentLength: maxMb * 1024 * 1024
  });

  return Buffer.from(response.data);
}

module.exports = { getImageBuffer };
