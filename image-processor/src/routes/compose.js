const express = require("express");
const { composeLayers } = require("../services/compositor");
const { params, ok } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { width = 1080, height = 1350, layers = [] } = params(req);
    const output = await composeLayers({ width, height, layers });
    res.json(ok(req, {
      contentType: "image/png",
      imageBase64: output.toString("base64")
    }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
