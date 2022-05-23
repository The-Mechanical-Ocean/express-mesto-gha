const router = require('express').Router();
const {
  getCards,
  createCards,
  deleteCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCards);
router.delete('/:cardId/likes', dislikeCard);
router.put('/:cardId/likes', likeCard);

module.exports = router;