function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createTextSvg({ width, height, text, style = {}, x = 80, y = 120 }) {
  const fontSize = Number(style.fontSize || 64);
  const fontFamily = style.fontFamily || "Arial";
  const fontWeight = style.fontWeight || "700";
  const color = style.color || "#FFFFFF";
  const shadowColor = style.shadowColor || "#000000";
  const shadowBlur = Number(style.shadowBlur || 0);

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" flood-color="${shadowColor}"/>
      </filter>
    </defs>
    <text x="${x}" y="${y}" fill="${color}" font-size="${fontSize}" font-family="${escapeXml(fontFamily)}" font-weight="${escapeXml(fontWeight)}" filter="url(#shadow)">${escapeXml(text)}</text>
  </svg>`;
}

module.exports = { createTextSvg };
