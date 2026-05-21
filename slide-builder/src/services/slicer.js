const sharp = require("sharp");

async function sliceImageByCount(imageBuffer, { sliceCount, slideWidth, slideHeight }) {
  const slices = [];
  for (let i = 0; i < sliceCount; i += 1) {
    const buf = await sharp(imageBuffer)
      .extract({ left: i * slideWidth, top: 0, width: slideWidth, height: slideHeight })
      .png()
      .toBuffer();
    slices.push(buf);
  }
  return slices;
}

module.exports = { sliceImageByCount };
