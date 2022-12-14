import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import NotFoundError from '../utils/errors/notFound';
import BadRequestError from '../utils/errors/badRequest';
import ForbiddenError from '../utils/errors/forbidden';
import { ISessionRequest } from '../utils/types';

const { Types } = require('mongoose');

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

export const createCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  Card.create({ ...req.body, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const deleteCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const addLike = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

export const removeLike = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const userId = Types.ObjectId(req.user?._id);
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};
