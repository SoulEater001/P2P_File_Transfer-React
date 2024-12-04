import mongoose from 'mongoose';

const transferHistorySchema = new mongoose.Schema(
    {
        sender: {
            // type: mongoose.Schema.Types.ObjectId,
            type: String,
            // ref: 'User',
            required: true,
        },
        receiver: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'User',
            type: String,
            required: true,
        },
        fileName: {
            type: String, required: true
        },
        fileSize: {
            type: Number, required: true

        },
        fileType: {
            type: String, required: true

        },
        status: {
            type: String, required: true

        },
        transferDate: {
            type: Date, default: Date.now

        },
    });

const TransferHistory = mongoose.model('TransferHistory', transferHistorySchema);
export default TransferHistory;
