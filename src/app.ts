import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import errorHandler from './middlewares/errorHandler';
import { ISessionRequest } from './utils/types';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: ISessionRequest, res: Response, next: NextFunction) => {
  req.user = { _id: '6327872911705528d1a7174c', };
  next();
});

app.use(router);

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});