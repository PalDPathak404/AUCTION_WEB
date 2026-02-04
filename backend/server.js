const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. MONGODB CONFIG ---
const saleSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    vanguard: { type: String, required: true, enum: ['Terra', 'Aqua', 'Aero', 'Ignis'] },
    timestamp: { type: Date, default: Date.now }
});
const Sale = mongoose.model('Sale', saleSchema);

let mongoConnected = false;
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => { console.log('✅ Mongo Connected'); mongoConnected = true; })
    .catch(err => console.error('❌ Mongo Error:', err));

// --- 2. GOOGLE SHEETS CONFIG ---
const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({
    version: 'v4',
    auth: auth
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const VANGUARD_COLS = {
    terra: 'A',
    aqua: 'B',
    aero: 'C',
    ignis: 'D'
};



// --- 3. CORE LOGIC ---
const appendToSheet = async (vanguard, text) => {
    try {
        const key = String(vanguard).trim().toLowerCase();
        const column = VANGUARD_COLS[key];

        if (!column) {
            console.error("❌ INVALID VANGUARD:", vanguard);
            return;
        }

        // Force append inside exact column range
        const range = `Sheet1!${column}2:${column}1000`;

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[text]] }
        });

        console.log("✅ Sheet Updated:", key, response.status);
    } catch (error) {
        console.error("❌ SHEET ERROR:", error.message);
    }
};


app.post('/api/sale', async (req, res) => {
    if (!mongoConnected) {
        return res.status(503).json({ success: false, error: "DB not ready" });
    }

    const { studentId, name, price, vanguard } = req.body;
    if (!studentId || !name || !price || !vanguard)
        return res.status(400).json({ success: false });

    try {
        const existing = await Sale.findOne({ studentId });

        await Sale.findOneAndUpdate(
            { studentId },
            { name, price, vanguard, timestamp: new Date() },
            { upsert: true }
        );

        res.json({ success: true });

        // Only append to sheet if student was not already sold
        if (!existing) {
            appendToSheet(vanguard, `${name} – ${price}`).catch(console.error);
        }


    } catch (error) {
        console.error('SERVER ERROR:', error);
        if (!res.headersSent) res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
