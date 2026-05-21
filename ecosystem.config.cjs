module.exports = {
  apps: [
    {
      name: "image-processor",
      cwd: "./image-processor",
      script: "src/index.js",
      env: { NODE_ENV: "production", PORT: 3001 }
    },
    {
      name: "slide-builder",
      cwd: "./slide-builder",
      script: "src/index.js",
      env: { NODE_ENV: "production", PORT: 3002 }
    },
    {
      name: "video-processor",
      cwd: "./video-processor",
      script: "src/index.js",
      env: { NODE_ENV: "production", PORT: 3003 }
    },
    {
      name: "remotion-renderer",
      cwd: "./remotion-renderer",
      script: "src/index.js",
      env: { NODE_ENV: "production", PORT: 3004 }
    }
  ]
};
