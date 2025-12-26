require("./instrument.js");
const Sentry = require("@sentry/node");
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const language = require("i18n");
const { errorHandler } = require("./middlewares/error.middleware");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const https = require('https');
const cron = require("node-cron");
const cronjobs = require("./utils/cronjobs.js");

app.use(cors({ origin: "*", credentials: true }));
language.configure({
  locales: ["en"],
  defaultLocale: "en",
  autoReload: true,
  directory: __dirname + "/locales",
  queryParameter: "lang",
  objectNotation: true,
  syncFiles: true,
});
app.use(language.init);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.set("view engine", "ejs");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "SafarWonderLust API with Swagger",
      version: "0.1.0",
      description: "API Documentation for SaferWonderLust",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/admin_routes.js", "./routes/index.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.get('/', (req, res) => {
  res.send('Hello, HTTPS!');
}); 

//The 404 Route (ALWAYS Keep this as the last route)
app.get("/hello", async (req, res) => {
  const data = {
    name: "Ravi",
    phone: "+1234567890",
    email: "johndoe@example.com",
    order_id: "1234",
    package_name: "Manali Trip",
    batch_details: "Dec to Jan",
    travelers: [
      {
        name: "Ravi",
        startingPoint: "Delhi",
        dropPoint: "Delhi",
        price: "1000",
        startPrice: "1000",
        dropPrice: "1000",
        package_name: "Single Sharing",
      },
      {
        name: "Muskan",
        startingPoint: "Delhi",
        dropPoint: "Delhi",
        price: "1000",
        startPrice: "1000",
        dropPrice: "1000",
        package_name: "Single Sharing",
      },
    ],
    paid_amount: "2000",
    total_amount: "6000",
    remaining_amount: "4000",
    transaction_id: "1234",
    amount: "2000",
    date: "2022-12-12",
  };
  const html = await ejs.renderFile(
    path.join(__dirname, "src/services/mailtemplates/emailTemplate.ejs"),
    data
  );
  res.send(html);
});
app.get("*", (req, res) => {
  res.send("Page Not found 404", 404);
});

app.use((err, res, req, next) => {
  errorHandler(err, res, req);
});


app.listen(PORT, () => {
  console.log(`Our express server is up on port ${PORT}`);
});

cron.schedule("0 0 * * *", cronjobs.ExpireBannerOnDate);
cron.schedule("0 0 * * *", cronjobs.ExpireBatchesOnStartDate);
// cron.schedule("* * * * *", cronjobs.DeleterPartiallyDeletedItineraries);
// cron.schedule("* * * * *", cronjobs.insertIndexValueBasedOnCategoryOrderAsc);

module.exports = app;
