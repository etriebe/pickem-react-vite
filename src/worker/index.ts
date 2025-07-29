import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

// app.get("/api2/", (c) => c.json({ name: "Cloudflare" }));
export default app;
