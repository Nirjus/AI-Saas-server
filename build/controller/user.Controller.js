"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const userRegistartion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_Model_1.User.exists({ email: email });
        if (user) {
            throw (0, http_errors_1.default)(500, "User already have");
        }
        const JwtToken = (0, jsonwebtoken_2.default)({ name, email, password }, "5m", secret_1.jwtActivationKey);
        try {
            yield (0, sendEmail_1.senEmail)({
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
});
exports.userRegistartion = userRegistartion;
const activateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken_1.default.verify(token, secret_1.jwtActivationKey);
        if (!decoded) {
            throw (0, http_errors_1.default)(400, "Invalid Token");
        }
        const user = yield user_Model_1.User.exists({ email: decoded.email });
        if (user) {
            throw (0, http_errors_1.default)(400, "user already have");
        }
        yield user_Model_1.User.create(decoded);
        res.status(201).json({
            success: true,
            message: `${decoded.name} your account is activated successfully`,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.activateUser = activateUser;
const myProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_Model_1.User.findById(id);
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
});
exports.myProfile = myProfile;
const deleteProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const id = req.params.id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        if ((_b = user.avatar) === null || _b === void 0 ? void 0 : _b.public_id) {
            yield cloudinary_1.default.v2.uploader.destroy((_c = user === null || user === void 0 ? void 0 : user.avatar) === null || _c === void 0 ? void 0 : _c.public_id);
        }
        yield user_Model_1.User.findByIdAndDelete(id);
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
});
exports.deleteProfile = deleteProfile;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        const { name, avatar, address, phoneNumber } = req.body;
        const id = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found!");
        }
        if (name) {
            user.name = name;
        }
        if (avatar) {
            if ((_e = user === null || user === void 0 ? void 0 : user.avatar) === null || _e === void 0 ? void 0 : _e.public_id) {
                yield cloudinary_1.default.v2.uploader.destroy((_f = user === null || user === void 0 ? void 0 : user.avatar) === null || _f === void 0 ? void 0 : _f.public_id);
                const myCloude = yield cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "AI-Saas"
                });
                user.avatar = {
                    public_id: myCloude.public_id,
                    url: myCloude.secure_url
                };
            }
            else {
                const myCloude = yield cloudinary_1.default.v2.uploader.upload(avatar, {
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
        yield user.save();
        res.status(201).json({
            success: true,
            message: "User updated successfully",
            user
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const id = (_g = req.user) === null || _g === void 0 ? void 0 : _g._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, 'user not found');
        }
        if ((user === null || user === void 0 ? void 0 : user.password) === undefined) {
            throw (0, http_errors_1.default)(404, "updtate password is not available in social Authentication");
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const comparePassword1 = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
        if (!comparePassword1) {
            throw (0, http_errors_1.default)(404, "Old Password is incorrect");
        }
        if (newPassword !== confirmPassword) {
            throw (0, http_errors_1.default)(404, "Confirm password not matched!");
        }
        const updateUser = yield user_Model_1.User.findByIdAndUpdate(id, { password: confirmPassword }, { new: true });
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
});
exports.updatePassword = updatePassword;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_Model_1.User.findOne({ email: email });
        if (!user) {
            throw (0, http_errors_1.default)(404, "this user not exists");
        }
        const token = (0, jsonwebtoken_2.default)({ user }, "5m", secret_1.resetPassKey);
        yield (0, sendEmail_1.senEmail)({
            subject: "Reset Password Email",
            email: user === null || user === void 0 ? void 0 : user.email,
            html: `
           <h1>Hey ${user === null || user === void 0 ? void 0 : user.name}</h1>
           <h1>Click below link, to reset your Password</h1>
           <a href="${secret_1.frontendUrl}/forgot-password/${token}" target="_blank">RESET PASSWORD</a>
      `
        });
        res.status(201).json({
            success: true,
            message: `Please check your mail: ${user === null || user === void 0 ? void 0 : user.email} for reseating your password`,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const { token, resetPassword } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, secret_1.resetPassKey);
        if (!decoded) {
            throw (0, http_errors_1.default)(404, "Invalid token");
        }
        const update = yield user_Model_1.User.findByIdAndUpdate((_h = decoded.user) === null || _h === void 0 ? void 0 : _h._id, { password: resetPassword }, { new: true });
        res.status(201).json({
            success: true,
            message: "Password reset successfully"
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.resetPassword = resetPassword;
const getCreditCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const id = (_j = req.user) === null || _j === void 0 ? void 0 : _j._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        const credit = (user === null || user === void 0 ? void 0 : user.credit) ? user === null || user === void 0 ? void 0 : user.credit : 0;
        res.status(201).json({
            success: true,
            credit
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.getCreditCount = getCreditCount;
