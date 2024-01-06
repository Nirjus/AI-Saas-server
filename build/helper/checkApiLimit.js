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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAPIlimit = void 0;
const user_Model_1 = require("../model/user.Model");
const secret_1 = require("../secret/secret");
const checkAPIlimit = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (user === null || user === void 0 ? void 0 : user.credit) {
            if ((user === null || user === void 0 ? void 0 : user.credit) < secret_1.maxFreeCredit) {
                yield user_Model_1.User.findByIdAndUpdate(id, {
                    credit: (user === null || user === void 0 ? void 0 : user.credit) + 1
                });
                return true;
            }
            else {
                return false;
            }
        }
        else {
            yield user_Model_1.User.findByIdAndUpdate(id, {
                credit: 1
            });
            return true;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.checkAPIlimit = checkAPIlimit;
