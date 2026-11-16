import fs from "fs";
const data="This is a synchronous file operations program.";
fs.writeFileSync("example.txt",data,"utf8");
const readData=fs.readFileSync("example.txt","utf8");
console.log(readData);
const newData="This is the modified data about synchronoud file operations";
fs.appendFileSync("example.txt",newData,"utf8");
const readNewData=fs.readFileSync("example.txt","utf8");
console.log(readNewData);