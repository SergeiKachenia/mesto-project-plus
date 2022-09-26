import { Router } from 'express';
import uRouter from './users';
import cRouter from './cards';

const mainRouter = Router();

mainRouter.use('/users', uRouter);
mainRouter.use('/cards', cRouter);

export default mainRouter;
