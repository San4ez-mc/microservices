const fs = require("fs/promises");
const path = require("path");

async function loadTemplate(templatePath) {
  const fullPath = path.join(__dirname, "..", "templates", templatePath);
  return fs.readFile(fullPath, "utf-8");
}

function injectData(template, data) {
  return template.replace("__DATA__", JSON.stringify(data));
}

module.exports = { loadTemplate, injectData };
