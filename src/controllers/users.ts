import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import NotFoundError from '../utils/errors/notFound';
import BadRequestError from '../utils/errors/badRequest';
import { ISessionRequest } from '../utils/types';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    User.create(req.body)
      .then((user) => res.status(200).send({ data: user }))
      .catch(next);
  };

export const updateUser = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const updateAvatar = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { avatar } = req.body.avatar;

  User.findByIdAndUpdate(userId, avatar, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};