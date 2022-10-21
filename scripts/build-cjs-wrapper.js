require("fs").writeFileSync(
  'dist/wrapper.js',
  'module.exports = require("./index.js").default;'
)
