import express from "express";
import { PostRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [process.env.APP_URL!, "http://localhost:3000"],
    credentials: true,
  })
);

// Express-BetterAuth GUIDE: https://www.better-auth.com/docs/integrations/express
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

// routes
app.use("/posts", PostRouter);
app.use("/auth", PostRouter);

app.get("/", (_, res) => {
  res.json({ success: true, message: "Blog app is running..." });
});

export default app;
