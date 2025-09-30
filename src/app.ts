import express from 'express';
import 'dotenv/config';
import routes from './routes.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/', routes);

(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  app.listen(process.env.SERVER_PORT);
  console.log(`Server is running at http://localhost:${process.env.SERVER_PORT}`);
})();