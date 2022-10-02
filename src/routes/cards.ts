import { Router } from 'express';
import {
  getCards, createCard, deleteCard, addLike, removeLike,
} from '../controllers/cards';
import { cardValidation, idValidation } from '../utils/validation';

const router = Router();

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', idValidation, deleteCard);
router.put('/:cardId/likes', idValidation, addLike);
router.delete('/:cardId/likes', idValidation, removeLike);

export default router;
