import express from 'express';
import { getPessoas, getPessoa, insertPessoa, updatePessoa, deletePessoa } from '../controllers/pessoaController.js';

const router = express.Router();

router.get('/', getPessoas);
router.get('/:id', getPessoa);
router.post('/', insertPessoa);
router.put('/:id', updatePessoa);
router.delete('/:id', deletePessoa);

export default router;
