const fs = require("fs")

try {
  const arrayOfFiles = fs.readdirSync(".");
  console.log(arrayOfFiles)
} catch(e) {
  console.log(e)
}