"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/setsuna.prod.cjs")
} else {
  module.exports = require("./dist/setsuna.cjs")
}
