import { ObjectId } from 'mongoose';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface IUser {
  name: string,
  about: string,
  avatar?: string,
  email: string,
  password: string,
}

export interface ICard {
  name: string,
  link: string,
  owner: ObjectId,
  likes: ObjectId[],
  createdAt: Date,
}
export interface ISessionRequest extends Request {
  user?: {
    _id: string
  }
}

export interface IAuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export interface IError extends Error {
  statusCode: number;
  code?: number;
}
