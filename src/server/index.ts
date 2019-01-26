import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as dotenv from 'dotenv';

import loginController from './controllers/login';

dotenv.config();

const { EXPRESS_PORT } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loginController);

app.listen(EXPRESS_PORT, () => {
  console.log(`Listening on port ${EXPRESS_PORT}!`);
});
