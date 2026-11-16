const fs = require("fs");
fs.writeFile("sample.txt", "Hello Node.js\n", (err) => {
    if (err) throw err;
    console.log("Write Successful");
    fs.appendFile("sample.txt", "Welcome to File System Module", (err) => {
        if (err) throw err;
        console.log("Append Successful");
        fs.readFile("sample.txt", "utf8", (err, data) => {
            if (err) throw err;
            console.log("File Content:\n" + data);
        });
    });
});