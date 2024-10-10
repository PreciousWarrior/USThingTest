import express from "express";
import libraryRoutes from "./routes/library.js";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "USThing API",
      description: "UsThing API Information",
      contact: {
        name: "IamPrecious",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: [`./src/routes/*.js`],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerDocs)
);

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/library", libraryRoutes);

export default app;
