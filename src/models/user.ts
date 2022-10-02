import {
  Schema, Model, Document, model,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser } from '../utils/types';
import avatarUrlRegexp from '../utils/constants';
import UnauthorizedError from '../utils/errors/unauthorized';

export interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<IUser>>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Поле должно содержать от 2 до 30 символов'],
    maxlength: [30, 'Поле должно содержать от 2 до 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Поле должно содержать от 2 до 200 символов'],
    maxlength: [200, 'Поле должно содержать от 2 до 200 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => avatarUrlRegexp.test(v),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный формат',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password').then((user: IUser | null) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверная почта или пароль'));
          }
          return user;
        });
    });
});

export default model<IUser, IUserModel>('user', userSchema);
