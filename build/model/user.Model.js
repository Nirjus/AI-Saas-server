"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        trim: true,
        maxlength: [30, "Excide the name character limit, maximum length 30"],
        minlength: [3, "name must contain atlist 3 character"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        validate: {
            validator: function (v) {
                return emailRegexp.test(v);
            },
            message: "Email must contain the valid expression",
        },
        unique: true,
    },
    password: {
        type: String,
        minlength: [6, "minmum length is 6"],
        set: (v) => bcryptjs_1.default.hashSync(v, bcryptjs_1.default.genSaltSync(10)),
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    socialAvatar: {
        type: String,
    },
    credit: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model("users", userSchema);
