export const v1OpenApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Bhakti App API",
    version: "0.1.0",
  },
  servers: [{ url: "/api/v1" }],
  paths: {
    "/health/live": {
      get: {
        summary: "Liveness check",
        responses: {
          "200": { description: "The process is alive" },
        },
      },
    },
    "/bootstrap": {
      get: {
        summary: "Bootstrap onboarding data",
        responses: {
          "200": { description: "Bootstrap payload for mobile onboarding" },
        },
      },
    },
    "/home/today": {
      get: {
        summary: "Today view model",
        responses: {
          "200": { description: "Daily summary view model" },
        },
      },
    },
  },
};
