const express = require("express");
const { renderHtmlToPng } = require("../services/puppeteerPool");
const { loadTemplate, injectData } = require("../services/templateRenderer");
const { params, ok } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const data = params(req);
    const templateName = data.template || "default";
    const template = await loadTemplate(`story/${templateName}.html`);
    const html = injectData(template, data);
    const image = await renderHtmlToPng(html, { width: 1080, height: 1350 });
    res.json(ok(req, { contentType: "image/png", imageBase64: image.toString("base64") }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
