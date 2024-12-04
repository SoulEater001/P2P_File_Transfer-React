import express from 'express';
import TransferHistory from '../models/history.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Fetch transfer history for the logged-in user
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const history = await TransferHistory.find({ user: req.user.id }).sort({ transferDate: -1 }); // Sort by transferDate descending
        res.status(200).json({ history });
    } catch (err) {
        console.error('Error fetching transfer history:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
