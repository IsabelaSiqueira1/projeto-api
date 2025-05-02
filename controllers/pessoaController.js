import { getAllPessoas, getPessoa as getPessoaModel, insertPessoa as insertPessoaModel, updatePessoa as updatePessoaModel, deletePessoa as deletePessoaModel } from '../models/pessoaModel.js'; // Renomeando todas as funções importadas

export async function getPessoas(req, res) {
    try {
        const pessoas = await getAllPessoas(); 
        res.json(pessoas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pessoas' });
    }
}

export async function getPessoa(req, res) {
    const { id } = req.params;
    try {
        const pessoa = await getPessoaModel(id); 
        if (!pessoa) {
            return res.status(404).json({ message: 'Pessoa não encontrada' });
        }
        res.json(pessoa);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar a pessoa' });
    }
}

export async function insertPessoa(req, res) {
    try {
        const { nome, idade } = req.body;
        const novaPessoa = await insertPessoaModel({ nome, idade });
        res.status(201).json(novaPessoa);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao inserir pessoa' });
    }
}

export async function updatePessoa(req, res) {
    try {
        const pessoa = req.body;
        const id = req.params.id;
        const updated = await updatePessoaModel(id, pessoa);
        if (updated) {
            res.json({ message: 'Pessoa atualizada com sucesso' });
        } else {
            res.status(404).json({ message: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar pessoa' });
    }
}

export async function deletePessoa(req, res) {
    try {
        const id = req.params.id;
        const deleted = await deletePessoaModel(id);
        if (deleted) {
            res.json({ message: 'Pessoa excluída com sucesso' });
        } else {
            res.status(404).json({ message: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir pessoa' });
    }
}
