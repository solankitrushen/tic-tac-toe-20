import express from "express";
import databaseConnection from "./database/connection.js";
import expressApp from "./express-app.js";
import chalk from "chalk";


const StartServer = async () => {
  const app = express();
  await databaseConnection();
  await expressApp(app);
  app
    .listen(process.env.PORT, () => {
      console.log(chalk.greenBright(`listening to port ${process.env.PORT}`));
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
