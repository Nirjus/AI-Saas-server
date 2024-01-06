"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAPIlimit = void 0;
const user_Model_1 = require("../model/user.Model");
const secret_1 = require("../secret/secret");
const checkAPIlimit = async (user, id) => {
    try {
        if (user?.credit) {
            if (user?.credit < secret_1.maxFreeCredit) {
                await user_Model_1.User.findByIdAndUpdate(id, {
                    credit: user?.credit + 1
                });
                return true;
            }
            else {
                return false;
            }
        }
        else {
            await user_Model_1.User.findByIdAndUpdate(id, {
                credit: 1
            });
            return true;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.checkAPIlimit = checkAPIlimit;
