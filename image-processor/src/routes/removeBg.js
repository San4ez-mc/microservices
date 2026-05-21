const express = require("express");
const { getImageBuffer } = require("../utils/fetchImage");
const { removeBackgroundFromImage } = require("../services/bgRemoval");
const { params, ok } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { imageUrl, imageBase64 } = params(req);
    const inputBuffer = await getImageBuffer({ imageUrl, imageBase64, maxMb: Number(process.env.MAX_IMAGE_SIZE_MB || 20) });
    const output = await removeBackgroundFromImage(inputBuffer);
    res.json(ok(req, {
      contentType: "image/png",
      imageBase64: output.toString("base64")
    }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
