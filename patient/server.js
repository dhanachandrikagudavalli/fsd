import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

const app = express();
const PORT = 6500;

// ===============================
// 1. THIRD-PARTY MIDDLEWARE
// ===============================

app.use(cors());
app.use(morgan("dev"));

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===============================
// 2. CUSTOM LOGGER MIDDLEWARE
// ===============================

const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        const logMessage =
            `${new Date().toISOString()} | ` +
            `${req.method} ${req.originalUrl} | ` +
            `${res.statusCode} | ` +
            `${duration}ms\n`;

        fs.appendFile("server.log", logMessage, (err) => {
            if (err) {
                console.error("Failed to write to log file:", err);
            }
        });
    });

    next();
};

app.use(logger);


// ===============================
// 3. ROUTE-SPECIFIC MIDDLEWARE
// ===============================

const validatePatient = (req, res, next) => {
    const { name, age, ward } = req.body;

    if (!name || !age || !ward) {
        const err = new Error("Patient details are missing");
        err.statusCode = 400;
        return next(err);
    }

    next();
};


// ===============================
// 4. DATA
// ===============================

let patients = [];

let nextId = 1;


// ===============================
// 5. HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.send("Hello, World!");
});


// ===============================
// 6. CREATE PATIENT
// POST /api/v1/patients
// ===============================

app.post("/api/v1/patients", validatePatient, (req, res) => {

    const { name, age, ward } = req.body;

    const patient = {
        id: nextId++,
        name,
        age,
        ward
    };

    patients.push(patient);

    res.status(201).json({
        message: "Patient record created successfully",
        patient
    });
});


// ===============================
// 7. GET ALL / SEARCH PATIENTS
// GET /api/v1/patients
// GET /api/v1/patients?word=John
// ===============================

app.get("/api/v1/patients", (req, res) => {

    const word = req.query.word;

    if (word) {

        const result = patients.filter((patient) =>
            patient.name.toLowerCase().includes(word.toLowerCase()) ||
            patient.ward.toLowerCase().includes(word.toLowerCase())
        );

        return res.status(200).json({
            message: "Patient records fetched successfully",
            patients: result
        });
    }

    res.status(200).json({
        message: "All patient records fetched successfully",
        patients
    });
});


// ===============================
// 8. GET PATIENT BY ID
// GET /api/v1/patients/:id
// ===============================

app.get("/api/v1/patients/:id", (req, res, next) => {

    const id = Number(req.params.id);

    const patient = patients.find((p) => p.id === id);

    if (!patient) {
        const err = new Error("Patient record not found");
        err.statusCode = 404;
        return next(err);
    }

    res.status(200).json({
        message: `Patient record with ID ${id} fetched successfully`,
        patient
    });
});


// ===============================
// 9. UPDATE PATIENT
// PUT /api/v1/patients/:id
// ===============================

app.put("/api/v1/patients/:id", validatePatient, (req, res, next) => {

    const id = Number(req.params.id);

    const patientIndex = patients.findIndex(
        (patient) => patient.id === id
    );

    if (patientIndex === -1) {
        const err = new Error("Patient record not found");
        err.statusCode = 404;
        return next(err);
    }

    const { name, age, ward } = req.body;

    patients[patientIndex] = {
        id,
        name,
        age,
        ward
    };

    res.status(200).json({
        message: `Patient record with ID ${id} updated successfully`,
        patient: patients[patientIndex]
    });
});


// ===============================
// 10. DELETE PATIENT
// DELETE /api/v1/patients/:id
// ===============================

app.delete("/api/v1/patients/:id", (req, res, next) => {

    const id = Number(req.params.id);

    const patientIndex = patients.findIndex(
        (patient) => patient.id === id
    );

    if (patientIndex === -1) {
        const err = new Error("Patient record not found");
        err.statusCode = 404;
        return next(err);
    }

    const deletedPatient = patients.splice(patientIndex, 1);

    res.status(200).json({
        message: `Patient record with ID ${id} deleted successfully`,
        patient: deletedPatient[0]
    });
});


// ===============================
// 11. 404 ROUTE
// ===============================

app.use((req, res) => {
    res.status(404).json({
        message: "Resource not found"
    });
});


// ===============================
// 12. ERROR HANDLING MIDDLEWARE
// ===============================

app.use((err, req, res, next) => {

    const errorCode = err.statusCode || 500;

    const message = err.message || "Internal server error";

    res.status(errorCode).json({
        error: message
    });
});


// ===============================
// 13. START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});