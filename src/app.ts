import express from 'express';
import 'dotenv/config';
import routes from './routes.js';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});