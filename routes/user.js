import { Router } from "express";
import users from "../database.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import fs from 'fs';

const router = new Router();

/**
 * 
 * @param {*} message 
 */
function writeLog(message) {
    const pad = (n) => n.toString().padStart(2, '0');

    const date = new Date();
    const timeStamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const logEntry = timeStamp + "  " + message + "\n";
    fs.writeFileSync("webTokenLog.log", logEntry, {flag: 'a', encoding: 'utf8'});
}

/**
 * 
 * @param {*} pwd1 
 * @param {*} pwd2 
 * @param {*} user 
 * @returns 
 */
function testPasswordAndSignToken(pwd1, pwd2, user) {
    if (pwd1 === pwd2) {
        const token = signToken(user);
        return token;
    } else {
        writeLog("Tokenerstellung (testPasswordAndSignToken) - Falsches Passwort.")
        return "Falsches Passort";
    }
}

/**
 * 
 * @param {*} userEmail 
 * @returns 
 */
function searchUserByEmail(userEmail) {
    let retUser = undefined;

    for (const user of users) {
        if (user.email === userEmail && user.password !== undefined) {
            retUser = user;
            break;
        }
    }

    return retUser;
}

/*
*/
router.post("/login", (req, res) => {
    console.log("login");

    const user = searchUserByEmail(req.body.email);

    if (user !== undefined) {
        res.send(testPasswordAndSignToken(user.password, req.body.password, user));
    } else {
        res.send("404");
    }
});

/*
*/
router.post("/verify", (req, res) => {
    const token = req.body.token;

    const result = verifyToken(token);

    if (result === undefined) {
        res.send("401 - unauthorized");
    } else {
        res.send(result);
    }
});

export default router;
