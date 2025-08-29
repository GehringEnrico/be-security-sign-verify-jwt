/**
 * Dieses Modul stellt Methoden zur Erstellung und Verifizierung eines Tokens bereit.
 * 
 * Hierfuer wird das Modul ***jsonwebtoken*** herangezogen.
 * 
 * Der Schluessel fuer den Token wird in der Datei ***.env*** gespeichert, welches mit
 * mit dem Schluesselwort ***process*** gelesen wird.
 * 
 * Um die Umgebungsvariable in ***.env*** mit ***process*** auslesen zu koennen, wird
 * das ***dotenv*** Modul benutzt.
 */
const infoModule = "Beschreibung des Moduls";

import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

// Wichtig, um die Umgebungsvariable aus der ***.env*** Datei mit process lesen zu koennen.
dotenv.config();

/**
 * Diese Methode erstellt einen Token und uebergibt an diesen die Benutzerdaten ***email***
 * und ***_id***.
 * 
 * Aktuell ist fest eingestellt, dass der Token 1h lang gueltig ist ***{ expiresIn: "1h" });***
 * 
 * Zurueckgegeben wird der erstellte Token.
 * 
 * @param {*} user Die Benutzerdaten.
 */
export function signToken(user) {
    const payload = {};

    payload.email = user.email;
    payload._id = user._id;

    const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
    return token;
}

/**
 * Diese Methode verifiziert den uebergebenen Token. Dies wird in einer Try ... Catch - Anweisung
 * ausgefuehrt. Ist der Token ungueltig, wirft ***jsonwebtoken.verify*** einen Fehler und das
 * Programm bricht ab. Da das nicht gewollt ist, wird dies mit einer Try ... Catch - Anweisung
 * abgefangen.
 * 
 * Ist der Token verifiziert wurden, so wird der ***Payload***, also die Informationen im Token
 * zurueckgegeben.
 * 
 * @param {*} token Der Token, der verifiziert werden soll.
 * @returns ***undefined***, falls die Verfifizierung fehl schlug, ansonsten den ***Payload***.
 */
export function verifyToken(token) {

    try {
        const ret = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        return ret;
    } catch (err) {
        const error = Error(err);
        console.log("Falscher Token. Bitte nochmal versuchen.", error.message);
        return undefined;
    }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImljaEBkdS5jb20iLCJfaWQiOjEyMzQsImlhdCI6MTc1NjM4MjU4MCwiZXhwIjoxNzU2Mzg2MTgwfQ.qt05qCXKlYstvZoMwp-gTRf6DGXobCdk6hT-n8JBfI8
// const myToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImljaEBkdS5jb20iLCJfaWQiOjEyMzQsImlhdCI6MTc1NjM4MjU4MCwiZXhwIjoxNzU2Mzg2MTgwfQ.qt05qCXKlYstvZoMwp-gTRf6DGXobCdk6hT-n8JBfI8";
// const user = { email: 'ich@du.com', _id: 1234 };
// // signToken(user);

// const verify = verifyToken(myToken);
// console.log(verify);