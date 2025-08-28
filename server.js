import express from "express";
import userRouter from "./routes/user.js";

const app = express();
const port = 3001;
const clientUrl = "http://localhost:3001";

app.use(express.json());
app.use("/", userRouter);

app.listen(port, () => {
  console.log(`The server 🙈 is listening on port ${port}`);
  console.log(`Visit ${clientUrl} in your browser`);
});
