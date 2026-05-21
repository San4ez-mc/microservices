const { removeBackground } = require("@imgly/background-removal-node");

async function removeBackgroundFromImage(inputBuffer) {
  const result = await removeBackground(inputBuffer, { output: { format: "image/png" } });
  if (Buffer.isBuffer(result)) {
    return result;
  }
  if (result && typeof result.arrayBuffer === "function") {
    const arr = await result.arrayBuffer();
    return Buffer.from(arr);
  }
  throw new Error("Unexpected background removal output");
}

module.exports = { removeBackgroundFromImage };
