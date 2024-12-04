import mongoose from "mongoose"

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        }
    },
    { timestamps: true }
);

// module.exports = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);
export default User;
