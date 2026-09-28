const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

/*

npm init -y
npm install express mysql2

*/

// Allow JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "medtracker_db"
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// ========================================
// GET - Retrieve All Medications
// ========================================

app.get("/api/medications", (req, res) => {
    const sql = "SELECT * FROM medications ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }
        res.json(results);
    });
});

// ========================================
// GET - Retrieve One Medication (for edit)
// ========================================

app.get("/api/medications/:id", (req, res) => {
    const sql = "SELECT * FROM medications WHERE id = ?";

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                message: "Medication not found"
            });
        }
        res.json(results[0]);
    });
});

// ========================================
// POST - Insert Medication
// ========================================

app.post("/api/medications", (req, res) => {
    const name = req.body.name;
    const dosage = req.body.dosage;
    const frequency = req.body.frequency;
    const duration = req.body.duration;
    const start_date = req.body.start_date;
    const category = req.body.category;

    const sql = `
        INSERT INTO medications
        (name, dosage, frequency, duration, start_date, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, dosage, frequency, duration, start_date, category],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(201).json({
                message: "Medication added successfully",
                id: result.insertId
            });
        }
    );
});

// ========================================
// PUT - Update Medication
// ========================================

app.put("/api/medications/:id", (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const dosage = req.body.dosage;
    const frequency = req.body.frequency;
    const duration = req.body.duration;
    const start_date = req.body.start_date;
    const category = req.body.category;

    const sql = `
        UPDATE medications
        SET name = ?, dosage = ?, frequency = ?, duration = ?, start_date = ?, category = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, dosage, frequency, duration, start_date, category, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Medication updated successfully"
            });
        }
    );
});

// ========================================
// DELETE - Delete Medication
// ========================================

app.delete("/api/medications/:id", (req, res) => {
    const sql = "DELETE FROM medications WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Medication deleted successfully"
        });
    });
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
