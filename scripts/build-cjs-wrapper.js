require("fs").writeFileSync(
  'dist/cjs/wrapper.js',
  'module.exports = require("./index.js").default;'
)
