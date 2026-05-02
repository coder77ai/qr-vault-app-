const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const valkey = require('../valkey');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});
const upload = multer({ storage });

// Create a new QR save
router.post('/', upload.single('qrImage'), async (req, res) => {
    try {
        const { name, category, shopName } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'QR Image is required' });
        }

        const qrData = {
            id: uuidv4(),
            name: name || 'Unnamed QR',
            shopName: shopName || 'Unknown Shop',
            category: category || 'General',
            imageUrl: `/uploads/${req.file.filename}`,
            createdAt: new Date().toISOString()
        };

        // Save to ValKey
        // Using a hash map for each qr, but also keeping a list or set to get all QRs easily
        await valkey.hset(`qr:${qrData.id}`, qrData);
        await valkey.zadd('qrs:list', Date.now(), qrData.id);

        res.status(201).json(qrData);
    } catch (error) {
        console.error('Error saving QR code:', error);
        res.status(500).json({ error: 'Failed to save QR code' });
    }
});

// Get all saved QRs
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;

        // Get all IDs from the sorted set
        const qrIds = await valkey.zrange('qrs:list', 0, -1);

        if (qrIds.length === 0) {
            return res.json([]);
        }

        // Fetch the data for each ID
        const pipeline = valkey.pipeline();
        qrIds.forEach(id => pipeline.hgetall(`qr:${id}`));
        const results = await pipeline.exec();

        let qrs = results.map(result => result[1]);

        if (search) {
            const lowerSearch = search.toLowerCase();
            qrs = qrs.filter(qr =>
                (qr.name && qr.name.toLowerCase().includes(lowerSearch)) ||
                (qr.shopName && qr.shopName.toLowerCase().includes(lowerSearch)) ||
                (qr.category && qr.category.toLowerCase().includes(lowerSearch))
            );
        }

        // Sort newest first
        qrs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(qrs);
    } catch (error) {
        console.error('Error fetching QRs:', error);
        res.status(500).json({ error: 'Failed to fetch QR codes' });
    }
});

// Delete a QR
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await valkey.del(`qr:${id}`);
        await valkey.zrem('qrs:list', id);
        res.json({ message: 'QR deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete QR code' });
    }
});

module.exports = router;
