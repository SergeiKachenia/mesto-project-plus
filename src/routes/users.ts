import { Router } from 'express';
import {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} from '../controllers/users';
import { avatarValidation, userValidation, idValidation } from '../utils/validation';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', idValidation, getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', userValidation, updateUser);
router.patch('/me/avatar', avatarValidation, updateAvatar);

export default router;
