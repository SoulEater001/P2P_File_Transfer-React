import express from 'express';
import TransferHistory from '../models/history.js';
import authMiddleware from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Fetch transfer history for the logged-in user
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const history = await TransferHistory.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
            .populate('sender', 'username email')
            .populate('receiver', 'username email')
            .sort({ transferDate: -1 });

        res.status(200).json({ history });
    } catch (err) {
        console.error('Error fetching transfer history:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/online-users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userPeerMapping = req.app.locals.userPeerMapping || {};
    const onlineUserIds = Object.keys(userPeerMapping).filter(id => id !== decoded.id);

    if (!onlineUserIds.length) return res.status(200).json({ users: [] });

    const users = await User.find({ _id: { $in: onlineUserIds } }).select('username email');

    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching online users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;
