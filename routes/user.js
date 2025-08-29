/**
 * Dieses Module erzeugt mit Hilfe von express Endpoints. S.g. Routes.
 * 
 * Es gibt zwei Endpoints:
 * 
 * ***1. Endpoint - POST (/Login)***
 * ```text
 * Dieser Endpoint nimmt eine E-Mail Adresse und ein Passwort entgegen. Der entsprechende Gegenpart wird aus der DB geholt
 * und die Passwoerter verglichen. Sind die Passwoerter gleich, wird der Token erzeugt und von der API zurueckgegeben.
 * Das erzeugen des Tokens wird im Modul ../utils/jwt.js vorgenommen.
 * ```
 * 
 * ***2. Endpoint - POST (/verify)***
 * ```text
 * Dieser Endpoint nimmt einen Token entgegen und verifiziert diesen. Ist der Token verifiziert, so wird der Payload
 * zurueckgegeben. Dies sind Informationen, die im Token hinterlegt sind. Hierfuer wird das Modul ../utils/jwt.js benutzt.
 * ```
 */
const infoModule = "Beschreibung des Moduls";

import { Router } from "express";
import users from "../database.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import fs from 'fs';

const router = new Router();

/**
 * Die Funktion schreibt unsere Logdatei. Die Logdatei wird im Rootverzeichnis abgelegt. Jede Zeile enthaelt einen TimeStamp:
 * ***YYYYMMDD hh:mm;ss*** gefolgt von der Meldung.
 * 
 * @param {*} message Die Meldung, die in die Logdatei geschrieben werden soll.
 */
function writeLog(message) {
    // Die Methode padStart fuellt den String von links mit dem String in Parameter 2 auf. Parameter 1 gibt an, wie lang der urspruengliche String sein soll.
    const pad = (n) => n.toString().padStart(2, '0');

    const date = new Date();
    const timeStamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const logEntry = timeStamp + "  " + message + "\n";
    fs.writeFileSync("webTokenLog.log", logEntry, {flag: 'a', encoding: 'utf8'});
}

/**
 * Diese Funktion vergleicht zwei Passwoerter. Sind diese identisch, so wird der Token erzeugt mit den entsprechenden
 * uebergebenen Benutzerdaten (Parameter ***user***)
 * 
 * @param {*} pwd1 Passwort 1
 * @param {*} pwd2 Passwort 2
 * @param {*} user Die Benutzerdaten, die in den Token einfliessen sollen.
 * @returns Der neu erstellte Token
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
 * Lesen der Benutzerdaten aus der Datenbank. Die Benutzerdatenbank ist hier fest hinterlegt.
 * ***users***. Dies ist ein JSON-Array, gelesen aus dem Modul ***database.js***.
 * 
 * Ist eine E-Mail gefunden wurden, muss auch ein zugehoeriges Passwort existieren.
 * Falls nicht, wird undefined zurueckgegeben, ansonsten das gefundene ***JSON - Objekt*** mit
 * den Benutzerdaten.
 * 
 * @param {*} userEmail Die E-Mail Adresse, die den Benutzer identifiziert.
 * @returns undefined, wenn die o.g. Bedingungen nicht erfuellt sind oder kein Benutzer mit 
 * zugehoeriger E-Mail Adresse gefunden wurde. Ansonsten das ***JSON - Objekt*** mit den 
 * Benutzerdaten.
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
 Der Endpoint (/login). Er nimmt eine E-Mail Adresse und ein Passwort entgegen.

 {
   "email": "nbiffen8@ycombinator.com",
   "password": "jfmdkdir"
 }

 Anschliessend werden die Benutzerdaten an Hand der E-Mail Adresse aus der DB gelesen,
 die Passwoerter verglichen und wenn diese uebereinstimmen wird der Token erstellt.

 Der Token wird anschliessend an den Client zurueckgegeben.
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
 Der Endpoint (/verify). Er nimmt einen Token entgegen und verfiziert diesen. Stimmt der 
 Token, so wird der Payload (Informationen zum Token) zurueckgegeben. 

 Falls die Verifizierung ***undefined*** zurueckgibt, wird ***401 - unauthorized*** an den
 Client zurueckgegeben.
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
