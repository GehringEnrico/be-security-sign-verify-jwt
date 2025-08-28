# Signing and verifying JSON Web Tokens (JWT)

In this exercise, you will build a backend service which signs and verifies JSON Web Tokens (JWT).

## Tasks

### Task 1

1. Install the npm library [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
2. Read the documentation for this library

### Task 2 - Creating a secret key

Since signing our tokens requires a secret key, we will use a `.env` file to store our secret

1. Create a new file `.env`, and create the property `SECRET_KEY` with a random string
2. Remember to use it when starting node

### Task 3 - Generating the token

In the file [lib/jwt.js](./lib/jwt.js);

1. Import the `jsonwebtoken` library
2. Create a `signToken` function which;
   - Has a **user** (object) as a parameter
   - Creates a `payload` variable which contains the `email` and `_id` properties from the **user** object
   - Uses the `sign` method from the `jsonwebtoken` library to create a token with the `payload` variable
   - Use the following configuration object to set an expiry date of 1 hour from now `{ expiresIn: '1h' }`
3. Export your function

> Don't forget to use the value stored at `process.env.SECRET_KEY` to sign your token!

> Also, include your `payload` variable in the token when signing it

#### Example

```js
jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
```

### Task 4 - Verifying a token

In the same file, create a `verifyToken` function which;

1. Receives a token (string) parameter
2. Uses the `verify` method from the `jsonwebtoken` library to verify the token
3. Returns the value from the `verify` function
4. Export your function

> You will also need the `process.env.SECRET_KEY` property when verifying your token!

### Task 5 - Handling the login behavior

In the file [routes/user.js](./routes/user.js), in the request handler for the endpoint `"/login"`;

1. Search for the user in the array exported from `database.js`, using the JSON **body** `email` property
2. If the user can not be found, or the properties `email` or `password` do not exist;
   - Return a **404** error to the user
3. If the user can be found;
   - Check the passwords match using the JSON **body** `password` property
   - Import and use the function `signToken` to create a **JSON web token**, and return the **token** to the user in your response

### Task 6 - Handling the verify behavior

In the file [routes/user.js](./routes/user.js), in the request handler for your endpoint `"/verify"`;

1. Import and use the function `verifyToken`
2. Extract the JSON **body** `token` property, and run it through the `verifyToken` function
3. If the `verifyToken` function throws an error, or the `token` property does not exist;
   - **catch** the error and,
   - Return a **401** "unauthorized" error to the user
4. If the `verifyToken` function does not throw an error, it will return the token payload
   - Return the payload to the user

### Task 7 - Testing

Test your application with an API testing tool, sending the correct JSON data as required for the endpoint.

The _login_ path should be `http://localhost:3001/login`, and expects a JSON object like this:

```json
{
  "email": "nbiffen8@ycombinator.com",
  "password": "jfmdkdir"
}
```

The _verify_ path should be `http://localhost:3001/verify` and expects a JSON object like this:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmljZWx5IGRvbmUifQ.IOmqNfo2YqzGgUyU2kMAIaOcynKW6xPSRjWviNljTAo"
}
```

> Make sure you are sending POST requests!
