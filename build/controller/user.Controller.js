"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditCount = exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.updateProfile = exports.deleteProfile = exports.myProfile = exports.activateUser = exports.userRegistartion = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const jsonwebtoken_2 = __importDefault(require("../config/jsonwebtoken"));
const secret_1 = require("../secret/secret");
const sendEmail_1 = require("../helper/sendEmail");
const cloudinary_1 = __importDefault(require("cloudinary"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userRegistartion = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            throw new Error("Name is required");
        }
        if (!email) {
            throw new Error("Email is required");
        }
        if (!password) {
            throw new Error("Password is required");
        }
        const user = await user_Model_1.User.exists({ email: email });
        if (user) {
            throw (0, http_errors_1.default)(500, "User already have");
        }
        const JwtToken = (0, jsonwebtoken_2.default)({ name, email, password }, "5m", secret_1.jwtActivationKey);
        try {
            await (0, sendEmail_1.senEmail)({
                email: email,
                subject: "Account Activation Email",
                html: `
                <h1>Hey ${name},</h1>
                <h3>Please click this link for account activation.</h3>
                <a href="${secret_1.frontendUrl}/accountActivation/${JwtToken}" target="_blank">Activate Account</a>
            `,
            });
        }
        catch (error) {
            console.log("Error in sending email", error);
        }
        res.status(200).json({
            success: true,
            message: `Please visit your ${email} for account activation`,
            token: JwtToken,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.userRegistartion = userRegistartion;
const activateUser = async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken_1.default.verify(token, secret_1.jwtActivationKey);
        if (!decoded) {
            throw (0, http_errors_1.default)(400, "Invalid Token");
        }
        const user = await user_Model_1.User.exists({ email: decoded.email });
        if (user) {
            throw (0, http_errors_1.default)(400, "user already have");
        }
        await user_Model_1.User.create(decoded);
        res.status(201).json({
            success: true,
            message: `${decoded.name} your account is activated successfully`,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.activateUser = activateUser;
const myProfile = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.myProfile = myProfile;
const deleteProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        if (user.avatar?.public_id) {
            await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
        }
        await user_Model_1.User.findByIdAndDelete(id);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(201).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.deleteProfile = deleteProfile;
const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar, address, phoneNumber } = req.body;
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found!");
        }
        if (name) {
            user.name = name;
        }
        if (avatar) {
            if (user?.avatar?.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                const myCloude = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "AI-Saas"
                });
                user.avatar = {
                    public_id: myCloude.public_id,
                    url: myCloude.secure_url
                };
            }
            else {
                const myCloude = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "AI-Saas"
                });
                user.avatar = {
                    public_id: myCloude.public_id,
                    url: myCloude.secure_url
                };
            }
        }
        if (address) {
            user.address = address;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }
        await user.save();
        res.status(201).json({
            success: true,
            message: "User updated successfully",
            user
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, 'user not found');
        }
        if (user?.password === undefined) {
            throw (0, http_errors_1.default)(404, "updtate password is not available in social Authentication");
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const comparePassword1 = await bcryptjs_1.default.compare(oldPassword, user?.password);
        if (!comparePassword1) {
            throw (0, http_errors_1.default)(404, "Old Password is incorrect");
        }
        if (newPassword !== confirmPassword) {
            throw (0, http_errors_1.default)(404, "Confirm password not matched!");
        }
        const updateUser = await user_Model_1.User.findByIdAndUpdate(id, { password: confirmPassword }, { new: true });
        if (!updateUser) {
            throw (0, http_errors_1.default)(500, "Password not updated");
        }
        res.status(201).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.updatePassword = updatePassword;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await user_Model_1.User.findOne({ email: email });
        if (!user) {
            throw (0, http_errors_1.default)(404, "this user not exists");
        }
        const token = (0, jsonwebtoken_2.default)({ user }, "5m", secret_1.resetPassKey);
        await (0, sendEmail_1.senEmail)({
            subject: "Reset Password Email",
            email: user?.email,
            html: `
           <h1>Hey ${user?.name}</h1>
           <h1>Click below link, to reset your Password</h1>
           <a href="${secret_1.frontendUrl}/forgot-password/${token}" target="_blank">RESET PASSWORD</a>
      `
        });
        res.status(201).json({
            success: true,
            message: `Please check your mail: ${user?.email} for reseating your password`,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token, resetPassword } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, secret_1.resetPassKey);
        if (!decoded) {
            throw (0, http_errors_1.default)(404, "Invalid token");
        }
        const update = await user_Model_1.User.findByIdAndUpdate(decoded.user?._id, { password: resetPassword }, { new: true });
        res.status(201).json({
            success: true,
            message: "Password reset successfully"
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.resetPassword = resetPassword;
const getCreditCount = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        const credit = user?.credit ? user?.credit : 0;
        res.status(201).json({
            success: true,
            credit
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.getCreditCount = getCreditCount;
