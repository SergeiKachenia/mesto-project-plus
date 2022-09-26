import { Router } from 'express';
import {
  getCards, createCard, deleteCard, addLike, removeLike,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

export default router;
