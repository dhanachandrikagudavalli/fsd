import http from 'http';

const server = http.createServer((req, res) => {

    // POST - Create Student
    if (req.method == "POST" && req.url == "/students") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Student created successfully</h1>");
        res.end();
    }

    // GET - Student List
    else if (req.method == "GET" && req.url == "/students") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Student list</h1>");
        res.end();
    }

    // GET - Student Details
    else if (req.method == "GET" && req.url == "/students/1") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Student details</h1>");
        res.end();
    }

    // PUT - Update Student
    else if (req.method == "PUT" && req.url == "/students/1") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Student updated successfully</h1>");
        res.end();
    }

    // DELETE - Delete Student
    else if (req.method == "DELETE" && req.url == "/students/1") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Student deleted successfully</h1>");
        res.end();
    }

    // 404 - Not Found
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("<h1>404 NOT FOUND</h1>");
        res.end();
    }
});

server.listen(4000, () => {
    console.log("Server is running at http://localhost:4000/students");
});