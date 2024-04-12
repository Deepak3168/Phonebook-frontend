import express from 'express';
import jsonServer from 'json-server';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const router = jsonServer.router('person.json');
const middlewares = jsonServer.defaults();

app.use('/api', middlewares, router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
