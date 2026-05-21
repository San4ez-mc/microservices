const express = require("express");
const sharp = require("sharp");
const { getImageBuffer } = require("../utils/fetchImage");
const { params, ok } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { imageUrl, imageBase64, width, height, fit = "cover", format = "png" } = params(req);
    const image = await getImageBuffer({ imageUrl, imageBase64, maxMb: Number(process.env.MAX_IMAGE_SIZE_MB || 20) });

    const transformer = sharp(image).resize(width, height, { fit });
    const out = format === "jpeg" ? await transformer.jpeg().toBuffer() : format === "webp" ? await transformer.webp().toBuffer() : await transformer.png().toBuffer();

    res.json(ok(req, {
      contentType: format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png",
      imageBase64: out.toString("base64")
    }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
