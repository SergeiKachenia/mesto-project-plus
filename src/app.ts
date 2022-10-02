import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes';
import errorHandler from './middlewares/errorHandler';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { signinValidation, signupValidation } from './utils/validation';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
