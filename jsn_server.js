import http from "http";

const students = [];

const server = http.createServer((req, res) => {

    // POST - Create Student
    if (req.method === "POST" && req.url === "/students") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const newStudent = JSON.parse(body);
            students.push(newStudent);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Student created successfully",
                data: newStudent
            }));
        });
    }

    // GET - Get All Students
    else if (req.method === "GET" && req.url === "/students") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "List of Students",
            data: students
        }));
    }

    // GET - Get Student By ID
    else if (
        req.method === "GET" &&
        req.url.startsWith("/students/")
    ) {

        const studentId = parseInt(req.url.split("/")[2]);

        const student = students.find(
            s => s.id === studentId
        );

        if (student) {

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Student details",
                data: student
            }));

        } else {

            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Student not found"
            }));
        }
    }

    // PUT - Update Student
    else if (
        req.method === "PUT" &&
        req.url.startsWith("/students/")
    ) {

        const studentId = parseInt(req.url.split("/")[2]);

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const updatedStudent = JSON.parse(body);

            const indexToUpdate = students.findIndex(
                s => s.id === studentId
            );

            if (indexToUpdate !== -1) {

                students[indexToUpdate] = {
                    ...students[indexToUpdate],
                    ...updatedStudent,
                    id: studentId
                };

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Student updated successfully",
                    data: students[indexToUpdate]
                }));

            } else {

                res.writeHead(404, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Student not found"
                }));
            }
        });
    }

    // DELETE - Delete Student
    else if (
        req.method === "DELETE" &&
        req.url.startsWith("/students/")
    ) {

        const studentId = parseInt(req.url.split("/")[2]);

        const indexToDelete = students.findIndex(
            s => s.id === studentId
        );

        if (indexToDelete !== -1) {

            const deletedStudent =
                students.splice(indexToDelete, 1);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Student deleted successfully",
                data: deletedStudent[0]
            }));

        } else {

            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Student not found"
            }));
        }
    }

    // 404 - Route Not Found
    else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Page not found"
        }));
    }
});

// Start Server
server.listen(4000, () => {
    console.log("Server is running at http://localhost:4000");
});