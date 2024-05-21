const fs = require('fs') 

const filePath = process.argv[2];
const contentBuffer = fs.readFileSync(filePath);
const contentString = contentBuffer.toString();

const numberOfLines = contentString.split('\n').length - 1;

console.log(numberOfLines)
