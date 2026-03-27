const router = require('express').Router();
const { createRole, getRoles, updateRole, deleteRole } = require('../controllers/roleController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', getRoles);
router.post('/', verifyToken, isAdmin, createRole);
router.put('/:id', verifyToken, isAdmin, updateRole);
router.delete('/:id', verifyToken, isAdmin, deleteRole);

module.exports = router;
