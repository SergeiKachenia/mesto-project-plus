import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import avatarUrlRegexp from './constants';
import NotFoundError from './errors/notFound';

export const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    link: Joi.string().uri().pattern(avatarUrlRegexp),
  }),
});

export const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().pattern(avatarUrlRegexp),
    about: Joi.string().min(2).max(200),
  }),
});

export const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(avatarUrlRegexp),
  }),
});

export const idValidation = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Некорректный ID');
  }
  next();
};

export const signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(avatarUrlRegexp).message('Url аватара указан некорректно'),
  }),
});

export const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});
