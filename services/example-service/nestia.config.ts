import { INestiaConfig } from "@nestia/sdk";

const config: INestiaConfig = {
  input: ["src/**/*.controller.ts"],
  output: "dist/sdk",
  swagger: {
    output: "dist/swagger.json",
    info: {
      title: "Example Service API",
      description: "Nestia-generated Swagger API docs for example-service",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server"
      }
    ]
  }
};

export default config;
