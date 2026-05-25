const express = require("express");
const { renderHtmlToPng } = require("../services/puppeteerPool");
const { loadTemplate, injectData } = require("../services/templateRenderer");
const { params, ok } = require("../utils/mcp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const data = params(req);
    const slideWidth = Number(data.slideWidth || process.env.SLIDE_WIDTH || 1080);
    const slideHeight = Number(data.slideHeight || process.env.SLIDE_HEIGHT || 1350);
    const slides = Array.isArray(data.slides) ? data.slides : [];
    const width = slideWidth * Math.max(1, slides.length);
    // allow template selection; sanitize to alphanumeric + dash
    const tplName = (data.template || 'carousel-default').replace(/[^a-z0-9_-]/gi, '');
    const template = await loadTemplate(`carousel/${tplName}.html`);
    const html = injectData(template, { ...data, slideWidth, slideHeight });
    const image = await renderHtmlToPng(html, { width, height: slideHeight });
    res.json(ok(req, { contentType: "image/png", imageBase64: image.toString("base64") }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
