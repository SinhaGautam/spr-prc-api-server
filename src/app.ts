import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./core/logging/Logger";
import { E } from "./core/config/Environment";
import { v1OpenApiDocument } from "./openapi/v1";
import { authenticationMiddleware } from "./middleware/auth";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import { requestIdMiddleware } from "./middleware/request-id";
import { securityHeadersMiddleware } from "./middleware/security";
import { errorHandler } from "./lib/errors";

const app: Express = express();

app.disable("x-powered-by");
app.use(requestIdMiddleware);
app.use(
  pinoHttp({
    logger: logger.child({ service: E.APP_NAME }),
    customProps: (req) => ({ requestId: req.id, userId: req.user?.userId }),
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);
app.use(securityHeadersMiddleware);
app.use(cors({
  origin(origin, callback) {
    if (!origin || E.CORS_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(rateLimitMiddleware({ windowMs: 60_000, maxRequests: 120 }));

// API documentation is intentionally available only in development.
if (E.NODE_ENV === "development") {
  app.get("/api-docs/openapi.json", (_req, res) => {
    res.json(v1OpenApiDocument);
  });

  app.get("/api-docs", (_req, res) => {
    res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bhakti App API — Swagger UI</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      SwaggerUIBundle({
        url: "/api-docs/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        displayRequestDuration: true,
        persistAuthorization: false
      });
    </script>
  </body>
</html>`);
  });
}

app.use(authenticationMiddleware);
app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({
    error: { code: "RESOURCE_NOT_FOUND", message: "Endpoint not found.", requestId: req.id },
  });
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  errorHandler(error, req, res, next);
});

export default app;
