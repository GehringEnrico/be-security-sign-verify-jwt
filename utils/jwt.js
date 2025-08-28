import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 
 * @param {*} user 
 */
export function signToken(user) {
    const payload = {};

    payload.email = user.email;
    payload._id = user._id;

    const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
    return token;
}

/**
 * 
 * @param {*} token 
 * @returns 
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