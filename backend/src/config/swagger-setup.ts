import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

export const setupSwagger = (app: Express): void => {
  // Swagger Documentation
  app.use(
    "/v1/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "User Management API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};