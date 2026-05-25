const sharp = require("sharp");

async function sliceImageByCount(imageBuffer, { sliceCount, slideWidth, slideHeight }) {
  const meta = await sharp(imageBuffer).metadata();
  const actualSliceWidth = Math.floor(meta.width / sliceCount);
  const slices = [];
  for (let i = 0; i < sliceCount; i += 1) {
    const buf = await sharp(imageBuffer)
      .extract({ left: i * actualSliceWidth, top: 0, width: actualSliceWidth, height: meta.height })
      .resize(slideWidth, slideHeight, { fit: "fill" })
      .png()
      .toBuffer();
    slices.push(buf);
  }
  return slices;
}

module.exports = { sliceImageByCount };
