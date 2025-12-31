import express from "express";
import { PostRouter } from "./modules/post/post.router";
const app = express();

app.use(express.json());

// routes
app.use("/posts", PostRouter);

app.get("/", (_, res) => {
  res.json({ success: true, message: "Blog app is running..." });
});

export default app;
