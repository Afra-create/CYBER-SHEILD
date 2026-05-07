import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import router from "./routes";
import { logger } from "./lib/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup API routing
app.use("/api", router);

// Serve static assets from the consolidated build directory
const HUB_DIST = path.resolve(__dirname, "../../cyber-safety-hub/dist");
const VIDEO_DIST = path.resolve(__dirname, "../../cyber-surakshit-video/dist");

// Serve Video Module assets on /video
app.use("/video", express.static(VIDEO_DIST));

// Serve Main Hub assets on /
app.use("/", express.static(HUB_DIST));

// Handle SPA routing for both apps
app.get("*", (req, res) => {
  if (req.path.startsWith("/video")) {
    res.sendFile(path.join(VIDEO_DIST, "index.html"));
  } else if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(HUB_DIST, "index.html"));
  }
});

export default app;
