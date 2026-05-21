const sharp = require("sharp");
const { getImageBuffer } = require("../utils/fetchImage");
const { createTextSvg } = require("./svgText");

async function composeLayers({ width, height, layers = [] }) {
  let canvas = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: "#00000000"
    }
  });

  const composites = [];

  for (const layer of layers) {
    if (layer.type === "color") {
      canvas = sharp({
        create: {
          width,
          height,
          channels: 4,
          background: layer.color || "#000000"
        }
      });
      continue;
    }

    if (layer.type === "image") {
      const imageBuffer = await getImageBuffer({ imageUrl: layer.url, imageBase64: layer.imageBase64 });
      let input = sharp(imageBuffer);
      if (layer.width || layer.height) {
        input = input.resize(layer.width, layer.height, { fit: layer.fit || "contain" });
      }
      const buf = await input.png().toBuffer();
      composites.push({ input: buf, top: Number(layer.position?.y || 0), left: Number(layer.position?.x || 0) });
      continue;
    }

    if (layer.type === "text") {
      const svg = createTextSvg({
        width,
        height,
        text: layer.text || "",
        style: layer.style || {},
        x: Number(layer.position?.x || 80),
        y: Number(layer.position?.y || 120)
      });
      composites.push({ input: Buffer.from(svg) });
    }
  }

  return canvas.composite(composites).png().toBuffer();
}

module.exports = { composeLayers };
