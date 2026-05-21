const express = require("express");
const axios = require("axios");
const { sliceImageByCount } = require("../services/slicer");
const { params, ok, err } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { imageUrl, imageBase64, sliceCount, slideWidth, slideHeight } = params(req);
    const count = Number(sliceCount || 1);
    let imageBuffer;

    if (imageBase64) {
      const payload = imageBase64.split(",")[1] || imageBase64;
      imageBuffer = Buffer.from(payload, "base64");
    } else if (imageUrl) {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      imageBuffer = Buffer.from(response.data);
    } else {
      return res.status(400).json(err(req, 400, "imageUrl or imageBase64 is required", { code: "INVALID_INPUT" }));
    }

    const slides = await sliceImageByCount(imageBuffer, {
      sliceCount: count,
      slideWidth: Number(slideWidth || process.env.SLIDE_WIDTH || 1080),
      slideHeight: Number(slideHeight || process.env.SLIDE_HEIGHT || 1350)
    });

    res.json(ok(req, { slides: slides.map((buffer) => `data:image/png;base64,${buffer.toString("base64")}`) }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
