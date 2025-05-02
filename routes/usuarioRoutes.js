import { Router } from "express";
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/usuarios', authenticateToken, getUsuarios);
router.get('/usuario/:id', authenticateToken, getUsuario);
router.post('/usuario', createUsuario);
router.put('/usuario/:id', authenticateToken, updateUsuario);
router.delete('/usuario/:id', authenticateToken, deleteUsuario);

export default router;
