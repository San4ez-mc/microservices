const express = require("express");
const sharp = require("sharp");
const { getImageBuffer } = require("../utils/fetchImage");
const { createTextSvg } = require("../services/svgText");
const { params, ok } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { imageUrl, imageBase64, text, style = {} } = params(req);
    const image = await getImageBuffer({ imageUrl, imageBase64, maxMb: Number(process.env.MAX_IMAGE_SIZE_MB || 20) });
    const metadata = await sharp(image).metadata();
    const svg = createTextSvg({
      width: metadata.width,
      height: metadata.height,
      text: text || "",
      style,
      x: Number(style.paddingX || 60),
      y: Number((metadata.height || 1200) - (style.paddingY || 80))
    });

    const output = await sharp(image)
      .composite([{ input: Buffer.from(svg) }])
      .png()
      .toBuffer();

    res.json(ok(req, {
      contentType: "image/png",
      imageBase64: output.toString("base64")
    }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
