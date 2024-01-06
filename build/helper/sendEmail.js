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
exports.senEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const secret_1 = require("../secret/secret");
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: secret_1.smtpUserName,
        pass: secret_1.smtpPassword,
    },
});
// send mail with defined transport object
const senEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: secret_1.smtpUserName,
            to: emailData.email,
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        });
        console.log("Message sent: %s", info.response);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.senEmail = senEmail;
