import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: [validator.isEmail, "Invalid email"],
            createIndexes: { unique: true }
        },
        username: {
            type: String,
            required: [true, "Username is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false
        },

    },
    {
        timestamps: true
    }
);

// save user data if new and on update
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err as Error);
    }
});

// method to check password
userSchema.methods.validatePassword = function (password: string) {
    return bcryptjs.compare(password, this.password);
}

export default model<UserDocument>("User", userSchema);