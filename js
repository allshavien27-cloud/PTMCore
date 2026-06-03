/**
 * PTMCore Backend Server
 * Express.js server untuk API dan file serving
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files dari root

// Setup multer untuk file upload
const uploadDir = path.join(__dirname, 'data', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${timestamp}_${originalName}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                             'application/vnd.ms-excel'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file Excel (.xlsx, .xls) yang diizinkan'));
        }
    }
});

/**
 * Routes
 */

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'PTMCore server is running' });
});

// Upload file Excel
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Tidak ada file yang diupload' });
        }

        const filePath = path.join(uploadDir, req.file.filename);
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        res.json({
            success: true,
            message: 'File berhasil diupload dan diproses',
            data: jsonData,
            filename: req.file.filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Gagal memproses file: ' + error.message });
    }
});

// Get uploaded files list
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const fileList = files.map(filename => {
            const filepath = path.join(uploadDir, filename);
            const stats = fs.statSync(filepath);
            return {
                filename: filename,
                size: stats.size,
                created: stats.birthtime
            };
        });

        res.json({
            success: true,
            files: fileList
        });

    } catch (error) {
        console.error('Files list error:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar file' });
    }
});

// Delete uploaded file
app.delete('/api/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);

        // Security check - prevent directory traversal
        if (!filepath.startsWith(uploadDir)) {
            return res.status(403).json({ error: 'Akses ditolak' });
        }

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.json({ success: true, message: 'File berhasil dihapus' });
        } else {
            res.status(404).json({ error: 'File tidak ditemukan' });
        }

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Gagal menghapus file' });
    }
});

// Get file content
app.get('/api/files/:filename/data', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);

        // Security check
        if (!filepath.startsWith(uploadDir)) {
            return res.status(403).json({ error: 'Akses ditolak' });
        }

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File tidak ditemukan' });
        }

        const workbook = XLSX.readFile(filepath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        res.json({
            success: true,
            data: jsonData
        });

    } catch (error) {
        console.error('File read error:', error);
        res.status(500).json({ error: 'Gagal membaca file' });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route tidak ditemukan' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Terjadi kesalahan server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ========================================
    PTMCore Server Started
    ========================================
    Server running at: http://localhost:${PORT}
    
    Upload directory: ${uploadDir}
    
    API Endpoints:
    - GET  /api/health           - Check server status
    - POST /api/upload           - Upload Excel file
    - GET  /api/files            - List uploaded files
    - GET  /api/files/:id/data   - Get file content
    - DELETE /api/files/:id      - Delete file
    ========================================
    `);
});

module.exports = app;
