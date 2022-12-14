import { Schema, model } from 'mongoose';
import { ICard } from '../utils/types';
import avatarUrlRegexp from '../utils/constants';

const cardsSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  link: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate: {
      validator: (link: string) => avatarUrlRegexp.test(link),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<ICard>('card', cardsSchema);
